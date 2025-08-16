import { Review } from '../entities';
import { BasicRepository } from './basic.repository';
import { ReviewEntity } from '../../infrastructure/persistence/typeorm/entities';

export interface ReviewRepository
  extends BasicRepository<ReviewEntity, Review> {
  findByBook(bookId: string): Promise<Review | null>;
  save(review: ReviewEntity): Promise<Review>;
}
