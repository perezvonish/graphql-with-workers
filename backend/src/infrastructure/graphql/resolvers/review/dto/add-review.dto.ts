import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddReviewDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  text: string;

  @Field()
  @IsUUID()
  bookId: string;
}
