import { Book } from '../../src/domain/entities';
import { v4 } from 'uuid';

export const mockBook: Book = {
  id: v4(),
  reviews: [],
  title: 'Test',
};
