import { ReviewRepository } from '../../../../../src/domain/repositories';

export const ReviewRepositoryMock: jest.Mocked<ReviewRepository> = {
  save: jest.fn(),
  findByBook: jest.fn(),
  present: jest.fn(),
  presentMany: jest.fn(),
};
