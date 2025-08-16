export class ReviewAddedEvent {
  static readonly type = 'review.created';

  constructor(public readonly reviewId: string) {}
}
