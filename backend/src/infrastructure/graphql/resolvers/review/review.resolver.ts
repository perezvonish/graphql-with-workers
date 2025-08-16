import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReviewGraph } from '../../types';
import { Tokens } from '../../../../domain/tokens/tokens';
import { Inject } from '@nestjs/common';
import { AddReviewUsecase } from '../../../../domain/usecases';
import { AddReviewDto } from './dto/add-review.dto';

@Resolver(() => ReviewGraph)
export class ReviewResolver {
  constructor(
    @Inject(Tokens.Usecases.AddReview)
    private readonly addReviewUsecase: AddReviewUsecase,
  ) {}

  @Mutation(() => ReviewGraph)
  addReview(@Args('input') input: AddReviewDto) {
    return this.addReviewUsecase.execute(input);
  }
}
