import { Module } from '@nestjs/common';
import { ScheduleModule as NestJsScheduleModule } from '@nestjs/schedule';
import { OutboxDispatcher } from '../queue';
import { Tokens } from '../../domain/tokens/tokens';
import { OutboxRepositoryImpl } from '../persistence/typeorm/repositories';
import { OutboxEventEntity } from '../persistence/typeorm/entities/outbox-event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutboxEventEntity]),
    NestJsScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'review-events',
    }),
  ],
  providers: [
    { provide: Tokens.Repositories.Outbox, useClass: OutboxRepositoryImpl },

    OutboxDispatcher,
  ],
})
export class ScheduleModule {}
