export const OutboxRepositoryMock = {
  save: jest.fn(),

  findPendingByType: jest.fn(),
  markAsSent: jest.fn(),
  markAsFailed: jest.fn(),
  incrementRetry: jest.fn(),
  findByStatusOlderThan: jest.fn(),

  findById: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
  present: jest.fn(),
  presentMany: jest.fn(),
};
