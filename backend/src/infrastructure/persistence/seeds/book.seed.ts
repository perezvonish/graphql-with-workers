import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from '../typeorm/entities';

@Injectable()
export class BookSeeder {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepo: Repository<BookEntity>,
  ) {}

  async seed(): Promise<void> {
    const existing = await this.bookRepo.count();
    if (existing > 0) {
      console.log('[Seeder] Books already exist, skipping.');
      return;
    }

    const books = [
      {
        title: 'Clean Architecture',
      },
      {
        title: 'Designing Data-Intensive Applications',
      },
      {
        title: 'The Pragmatic Programmer',
      },
    ];

    const entities = books.map((data) => this.bookRepo.create(data));
    await this.bookRepo.save(entities);
    console.log(`[Seeder] Seeded ${entities.length} books`);
  }
}
