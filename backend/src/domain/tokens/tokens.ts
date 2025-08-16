export const Tokens = {
  Repositories: {
    Book: Symbol('BookRepository'),
    Review: Symbol('ReviewRepository'),
    Outbox: Symbol('OutboxRepository'),
    Transaction: Symbol('TransactionRepository'),
  },
  Usecases: {
    GetBooks: Symbol('GetBooksUsecase'),
    AddReview: Symbol('AddReviewUsecase'),
  },
};
