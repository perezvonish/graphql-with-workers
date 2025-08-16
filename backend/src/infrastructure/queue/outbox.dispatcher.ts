import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Tokens } from '../../domain/tokens/tokens';
import { OutboxRepository } from '../../domain/repositories';
import { OutboxEventEnum } from '../../domain/enums';
import { ReviewAddedEvent } from '../../domain/events';
import { OutboxEvent } from '../../domain/entities';

@Injectable()
export class OutboxDispatcher implements OnModuleInit {
  private readonly logger = new Logger(OutboxDispatcher.name);
  private readonly maxTries = 5;
  private readonly retryCooldown = 5 * 60 * 1000; // 5 minutes

  constructor(
    @Inject(Tokens.Repositories.Outbox)
    private readonly outboxRepo: OutboxRepository,

    @InjectQueue('review-events')
    private readonly queue: Queue,
  ) {}

  onModuleInit(): void {
    this.logger.debug(
      `Outbox dispatcher initialized. MaxTries => ${this.maxTries}`,
    );
  }

  @Cron(CronExpression.EVERY_SECOND)
  async handleOutbox(): Promise<void> {
    await this.dispatchPending();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleRetry(): Promise<void> {
    await this.retry();
  }

  private async dispatchPending(): Promise<void> {
    const events = await this.outboxRepo.findPendingByType(
      OutboxEventEnum.Pending,
    );

    for (const event of events) {
      await this.executeEvent(event);
    }
  }

  private async executeEvent(event: OutboxEvent) {
    try {
      if (event.retryCount >= this.maxTries) {
        this.logger.warn(`Event ${event.id} reached max retries. Skipping.`);
        return;
      }

      const parsed: ReviewAddedEvent = plainToInstance(
        ReviewAddedEvent,
        event.payload,
      );

      const jobId = `review-created:${parsed.reviewId}`;

      await this.queue.add('review-created', parsed, { jobId });

      await this.outboxRepo.markAsSent(event.id);
      this.logger.log(
        `Successfully dispatched event ${event.id} with jobId ${jobId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to dispatch event ${event.id}`, error);
      await this.outboxRepo.incrementRetry(event.id);
    }
  }

  private async retry() {
    const stuckEvents = await this.outboxRepo.findByStatusOlderThan(
      OutboxEventEnum.Sent,
      new Date(Date.now() - this.retryCooldown),
    );

    for (const event of stuckEvents) {
      await this.executeEvent(event);

      if (event.retryCount < this.maxTries) {
        await this.outboxRepo.incrementRetry(event.id);
      }

      if (event.retryCount == this.maxTries) {
        await this.outboxRepo.markAsFailed(event.id);
      }
    }
  }
}
