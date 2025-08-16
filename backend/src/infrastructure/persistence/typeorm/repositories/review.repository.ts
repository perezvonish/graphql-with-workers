import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../../../domain/repositories';
import { Review } from '../../../../domain/entities';
import { ReviewEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewRepositoryImpl implements ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repo: Repository<ReviewEntity>,
  ) {}

  async findByBook(bookId: string): Promise<Review | null> {
    const book = await this.repo.findOne({ where: { id: bookId } });

    if (!book) {
      return null;
    }

    return this.present(book);
  }

  present(data: ReviewEntity): Review {
    return new Review(data.id, data.text, data.book);
  }

  presentMany(data: ReviewEntity[]): Review[] {
    return data.map((d) => this.present(d));
  }

  async save(review: ReviewEntity): Promise<Review> {
    const saved = await this.repo.save(review);

    return this.present(saved);
  }
}
