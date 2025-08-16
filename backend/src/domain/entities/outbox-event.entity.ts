import { OutboxEventEnum } from '../enums';

export class OutboxEvent {
  constructor(
    public readonly id: string,

    public readonly eventType: string,
    public readonly payload: Record<string, unknown>,
    public readonly status: OutboxEventEnum = OutboxEventEnum.Pending,
    public readonly createdAt: Date = new Date(),

    public retryCount: number = 0,
    public lastTriedAt: Date | null = null,
  ) {}
}
