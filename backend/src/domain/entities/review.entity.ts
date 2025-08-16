import { Book } from './book.entity';

export class Review {
  constructor(
    public readonly id: string,

    public readonly text: string,
    public readonly book: Book,
  ) {}
}
