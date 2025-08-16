import { Module, OnModuleInit } from '@nestjs/common';
import { BookResolver } from '../graphql/resolvers';
import { Tokens } from '../../domain/tokens/tokens';
import { BookRepositoryImpl } from '../persistence/typeorm/repositories';
import { GetBookUsecaseImpl } from '../../application/usecases/get-books.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from '../persistence/typeorm/entities';
import { BookSeeder } from '../persistence/seeds';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],

  providers: [
    { provide: Tokens.Repositories.Book, useClass: BookRepositoryImpl },
    { provide: Tokens.Usecases.GetBooks, useClass: GetBookUsecaseImpl },

    BookResolver,

    BookSeeder,
  ],
})
export class BookModule implements OnModuleInit {
  constructor(private readonly bookSeeder: BookSeeder) {}

  async onModuleInit() {
    await this.bookSeeder.seed();
  }
}
