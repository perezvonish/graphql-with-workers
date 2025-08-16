import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ReviewGraph } from './review.graphql';

@ObjectType()
export class BookGraph {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field(() => [ReviewGraph])
  reviews!: ReviewGraph[];
}
