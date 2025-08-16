import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AddReviewUsecase } from '../../domain/usecases';
import { AddReviewType } from '../../domain/types';
import { Book, OutboxEvent, Review } from '../../domain/entities';
import { Tokens } from '../../domain/tokens/tokens';
import {
  BookRepository,
  OutboxRepository,
  ReviewRepository,
  TransactionRepository,
} from '../../domain/repositories';
import { v4 as uuidv4 } from 'uuid';
import { ReviewAddedEvent } from '../../domain/events';
import { OutboxEventEnum } from '../../domain/enums';

@Injectable()
export class AddReviewUsecaseImpl implements AddReviewUsecase {
  constructor(
    @Inject(Tokens.Repositories.Review)
    private readonly reviewRepo: ReviewRepository,

    @Inject(Tokens.Repositories.Outbox)
    private readonly outboxRepo: OutboxRepository,

    @Inject(Tokens.Repositories.Book)
    private readonly bookRepository: BookRepository,

    @Inject(Tokens.Repositories.Transaction)
    private readonly trx: TransactionRepository,
  ) {}

  async execute(payload: AddReviewType): Promise<Review> {
    const book = await this.validateBook(payload.bookId);

    const review = new Review(uuidv4(), payload.text, book);

    const event = new ReviewAddedEvent(review.id);

    const outbox = new OutboxEvent(
      uuidv4(),
      ReviewAddedEvent.type,
      { reviewId: event.reviewId },
      OutboxEventEnum.Pending,
      new Date(),
    );

    await this.trx.executeInTransaction(async () => {
      await this.bookRepository.save(book);
      await this.outboxRepo.save(outbox);
    });

    return review;
  }

  private async validateBook(bookId: string): Promise<Book> {
    const book = await this.bookRepository.findById({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }

    return book;
  }
}
