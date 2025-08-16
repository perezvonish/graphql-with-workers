import { OutboxEvent } from '../entities';
import { OutboxEventEnum } from '../enums';
import { BasicRepository } from './basic.repository';
import { OutboxEventEntity } from '../../infrastructure/persistence/typeorm/entities/outbox-event.entity';

export interface OutboxRepository
  extends BasicRepository<OutboxEventEntity, OutboxEvent> {
  save(event: OutboxEventEntity): Promise<OutboxEvent>;
  findPendingByType(type: OutboxEventEnum): Promise<OutboxEvent[]>;
  markAsSent(id: string): Promise<void>;
  markAsFailed(id: string): Promise<void>;
  incrementRetry(id: string): Promise<void>;
  findByStatusOlderThan(
    status: OutboxEventEnum,
    olderThan: Date,
  ): Promise<OutboxEvent[]>;
}
