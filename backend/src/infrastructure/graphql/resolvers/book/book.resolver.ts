import { Query, Resolver } from '@nestjs/graphql';
import { BookGraph } from '../../types';
import { Inject } from '@nestjs/common';
import { Tokens } from '../../../../domain/tokens/tokens';
import { GetBookUsecaseImpl } from '../../../../application/usecases/get-books.usecase';

@Resolver(() => BookGraph)
export class BookResolver {
  constructor(
    @Inject(Tokens.Usecases.GetBooks)
    private readonly getBookUsecase: GetBookUsecaseImpl,
  ) {}

  @Query(() => [BookGraph])
  getBooks() {
    return this.getBookUsecase.execute();
  }
}
