export class ReviewAddedEvent {
  readonly type = 'review.created';

  constructor(public readonly reviewId: string) {}
}
