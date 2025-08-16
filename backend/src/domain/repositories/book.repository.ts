import { Book } from '../entities';
import { BasicRepository } from './basic.repository';
import { BookEntity } from '../../infrastructure/persistence/typeorm/entities';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export interface BookRepository extends BasicRepository<BookEntity, Book> {
  findAll(options?: FindManyOptions<BookEntity>): Promise<Book[]>;
  findById(options?: FindOneOptions<BookEntity>): Promise<Book | null>;
  save(book: Book): Promise<Book>;
}
