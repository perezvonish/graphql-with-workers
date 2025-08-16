import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BookEntity } from './book.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => BookEntity, (book) => book.reviews)
  book!: BookEntity;
}
