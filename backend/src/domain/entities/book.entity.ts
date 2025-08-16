import { Review } from './review.entity';

export class Book {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly reviews: Review[],
  ) {}
}
