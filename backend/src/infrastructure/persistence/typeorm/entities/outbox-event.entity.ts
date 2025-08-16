import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OutboxEventEnum } from '../../../../domain/enums';

@Entity('outboxes')
export class OutboxEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventType: string;

  @Column({ type: 'json' })
  payload: Record<string, unknown>;

  @Column({ type: 'enum', enum: OutboxEventEnum })
  status: OutboxEventEnum;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  retryCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastTriedAt: Date | null;
}
