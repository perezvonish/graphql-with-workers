import { OutboxRepository } from '../../../../domain/repositories';
import { Injectable } from '@nestjs/common';
import { OutboxEventEnum } from '../../../../domain/enums';
import { OutboxEvent } from '../../../../domain/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { OutboxEventEntity } from '../entities/outbox-event.entity';

@Injectable()
export class OutboxRepositoryImpl implements OutboxRepository {
  constructor(
    @InjectRepository(OutboxEventEntity)
    private readonly repo: Repository<OutboxEventEntity>,
  ) {}

  async findPendingByType(type: OutboxEventEnum): Promise<OutboxEvent[]> {
    const outboxes = await this.repo.find({
      where: {
        status: type,
      },
    });

    if (!outboxes.length) {
      return [];
    }

    return this.presentMany(outboxes);
  }

  async save(event: OutboxEventEntity): Promise<OutboxEvent> {
    const saved = await this.repo.save(event);

    return this.present(saved);
  }

  present(data: OutboxEventEntity): OutboxEvent {
    return new OutboxEvent(
      data.id,
      data.eventType,
      data.payload,
      data.status,
      data.createdAt,
      data.retryCount,
      data.lastTriedAt,
    );
  }

  presentMany(data: OutboxEventEntity[]): OutboxEvent[] {
    return data.map((d) => this.present(d));
  }

  async incrementRetry(id: string): Promise<void> {
    const outbox = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!outbox) {
      return;
    }

    outbox.retryCount++;

    await this.save(outbox);
  }

  async markAsSent(id: string): Promise<void> {
    const outbox = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!outbox) {
      return;
    }

    outbox.status = OutboxEventEnum.Sent;

    await this.save(outbox);
  }

  async markAsFailed(id: string): Promise<void> {
    const outbox = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!outbox) {
      return;
    }

    outbox.status = OutboxEventEnum.Failed;

    await this.save(outbox);
  }

  async findByStatusOlderThan(
    status: OutboxEventEnum,
    olderThan: Date,
  ): Promise<OutboxEvent[]> {
    return this.repo.find({
      where: {
        status,
        createdAt: LessThan(olderThan),
      },
    });
  }
}
