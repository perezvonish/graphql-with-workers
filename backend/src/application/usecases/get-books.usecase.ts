import { Inject, Injectable } from '@nestjs/common';
import { GetBooksUsecase } from '../../domain/usecases';
import { Book } from '../../domain/entities';
import { Tokens } from '../../domain/tokens/tokens';
import { BookRepository } from '../../domain/repositories';

@Injectable()
export class GetBookUsecaseImpl implements GetBooksUsecase {
  constructor(
    @Inject(Tokens.Repositories.Book)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(): Promise<Book[]> {
    return await this.bookRepository.findAll();
  }
}
