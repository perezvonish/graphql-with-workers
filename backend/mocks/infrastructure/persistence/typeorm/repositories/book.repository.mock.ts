import { BookRepository } from '../../../../../src/domain/repositories';

export const BookRepositoryMock: jest.Mocked<BookRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  present: jest.fn(),
  presentMany: jest.fn(),
};
