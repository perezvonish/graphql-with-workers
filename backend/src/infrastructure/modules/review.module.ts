import { Module } from '@nestjs/common';
import { ReviewResolver } from '../graphql/resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity, ReviewEntity } from '../persistence/typeorm/entities';
import { Tokens } from '../../domain/tokens/tokens';
import {
  BookRepositoryImpl,
  OutboxRepositoryImpl,
  ReviewRepositoryImpl,
  TransactionRepositoryImpl,
} from '../persistence/typeorm/repositories';
import { AddReviewUsecaseImpl } from '../../application/usecases/add-review.usecase';
import { OutboxEventEntity } from '../persistence/typeorm/entities/outbox-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, OutboxEventEntity, BookEntity]),
  ],
  providers: [
    { provide: Tokens.Repositories.Review, useClass: ReviewRepositoryImpl },
    { provide: Tokens.Usecases.AddReview, useClass: AddReviewUsecaseImpl },
    { provide: Tokens.Repositories.Outbox, useClass: OutboxRepositoryImpl },
    { provide: Tokens.Repositories.Book, useClass: BookRepositoryImpl },
    {
      provide: Tokens.Repositories.Transaction,
      useClass: TransactionRepositoryImpl,
    },

    ReviewResolver,
  ],
})
export class ReviewModule {}
