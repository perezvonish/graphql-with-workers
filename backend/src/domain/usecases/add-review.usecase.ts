import { AddReviewType } from '../types';
import { Review } from '../entities';

export interface AddReviewUsecase {
  execute(payload: AddReviewType): Promise<Review>;
}
