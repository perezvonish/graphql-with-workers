import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { BookEntity } from '../entities';
import { Book } from '../../../../domain/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from '../../../../domain/repositories';

@Injectable()
export class BookRepositoryImpl implements BookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repo: Repository<BookEntity>,
  ) {}

  async findAll(options?: FindManyOptions<BookEntity>): Promise<Book[]> {
    const bookEntities = await this.repo.find({ ...options });

    if (!bookEntities.length) {
      return [];
    }

    return this.presentMany(bookEntities);
  }

  async findById(options?: FindOneOptions<BookEntity>): Promise<Book | null> {
    const bookEntity = await this.repo.findOne({ ...options });

    if (!bookEntity) {
      return null;
    }

    return this.present(bookEntity);
  }

  async save(book: Book): Promise<Book> {
    const saved = await this.repo.save({
      id: book.id,
      title: book.title,
    });

    return this.present(saved);
  }

  presentMany(data: BookEntity[]): Book[] {
    return data.map((d) => this.present(d));
  }

  present(data: BookEntity): Book {
    return {
      id: data.id,
      title: data.title,
      reviews: data.reviews,
    };
  }
}
