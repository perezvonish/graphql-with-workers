import { Book } from '../entities';

export interface GetBooksUsecase {
  execute(): Promise<Book[]>;
}
