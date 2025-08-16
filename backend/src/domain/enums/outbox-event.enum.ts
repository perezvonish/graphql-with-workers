export enum OutboxEventEnum {
  Pending = 'PENDING',
  Sent = 'SENT',
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
}
