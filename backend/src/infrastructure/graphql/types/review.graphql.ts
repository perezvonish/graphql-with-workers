import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BookGraph } from './book.graphql';

@ObjectType()
export class ReviewGraph {
  @Field(() => ID)
  id!: string;

  @Field()
  text!: string;

  @Field()
  book: BookGraph;
}
