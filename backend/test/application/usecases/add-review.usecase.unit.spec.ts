import { AddReviewUsecaseImpl } from '../../../src/application/usecases/add-review.usecase';
import { Review } from '../../../src/domain/entities';
import { BookRepositoryMock } from '../../../mocks/infrastructure/persistence/typeorm/repositories/book.repository.mock';
import { ReviewRepositoryMock } from '../../../mocks/infrastructure/persistence/typeorm/repositories/review.repository.mock';
import { OutboxRepositoryMock } from '../../../mocks/infrastructure/persistence/typeorm/repositories/outbox.repository.mock';
import { TransactionRepositoryMock } from '../../../mocks/infrastructure/persistence/typeorm/repositories/transaction.repository.mock';
import { mockBook } from '../../../mocks/books/book.mock';
import { AddReviewType } from '../../../src/domain/types';

describe('AddReviewUsecaseImpl', () => {
  let usecase: AddReviewUsecaseImpl;

  beforeAll(() => {
    usecase = new AddReviewUsecaseImpl(
      ReviewRepositoryMock,
      OutboxRepositoryMock,
      BookRepositoryMock,
      TransactionRepositoryMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create review and outbox event and return review', async () => {
    BookRepositoryMock.findById.mockResolvedValue(mockBook);
    TransactionRepositoryMock.executeInTransaction.mockImplementation(
      async (cb: () => Promise<void>) => {
        await cb();
      },
    );

    const payload: AddReviewType = {
      text: 'Test text',
      bookId: mockBook.id,
    };

    const saveSpy = ReviewRepositoryMock.save;

    const review = await usecase.execute(payload);

    expect(ReviewRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        book: mockBook,
        text: payload.text,
      }),
    );
    expect(ReviewRepositoryMock.save).toHaveBeenCalledWith(expect.any(Review));
    expect(saveSpy).toHaveBeenCalled();
    expect(review).toBeInstanceOf(Review);
    expect(review.text).toBe(payload.text);
  });

  it('should throw if book not found', async () => {
    BookRepositoryMock.findById.mockResolvedValue(null);

    const payload: AddReviewType = {
      text: 'Test text',
      bookId: 'non-existent-book-id',
    };

    await expect(usecase.execute(payload)).rejects.toThrowError(
      `Book with id ${payload.bookId} not found`,
    );

    expect(ReviewRepositoryMock.save).not.toHaveBeenCalled();
    expect(OutboxRepositoryMock.save).not.toHaveBeenCalled();
    expect(
      TransactionRepositoryMock.executeInTransaction,
    ).not.toHaveBeenCalled();
  });

  it('should throw if reviewRepo.save throws', async () => {
    BookRepositoryMock.findById.mockResolvedValue(mockBook);
    ReviewRepositoryMock.save.mockRejectedValue(new Error('DB error'));

    TransactionRepositoryMock.executeInTransaction.mockImplementation(
      async (cb: () => Promise<void>) => {
        await cb();
      },
    );

    const payload: AddReviewType = {
      text: 'Failing text',
      bookId: mockBook.id,
    };

    await expect(usecase.execute(payload)).rejects.toThrow('DB error');

    expect(ReviewRepositoryMock.save).toHaveBeenCalled();
    expect(OutboxRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw if outboxRepo.save throws', async () => {
    BookRepositoryMock.findById.mockResolvedValue(mockBook);
    ReviewRepositoryMock.save.mockResolvedValue({} as Review);
    OutboxRepositoryMock.save.mockRejectedValue(new Error('Outbox fail'));

    TransactionRepositoryMock.executeInTransaction.mockImplementation(
      async (cb: () => Promise<void>) => {
        await cb();
      },
    );

    const payload: AddReviewType = {
      text: 'Outbox should fail',
      bookId: mockBook.id,
    };

    await expect(usecase.execute(payload)).rejects.toThrow('Outbox fail');

    expect(ReviewRepositoryMock.save).toHaveBeenCalled();
    expect(OutboxRepositoryMock.save).toHaveBeenCalled();
  });
});
