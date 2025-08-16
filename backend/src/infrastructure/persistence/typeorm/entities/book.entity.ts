import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReviewEntity } from './review.entity';

@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => ReviewEntity, (review) => review.book, { cascade: true })
  reviews!: ReviewEntity[];
}
