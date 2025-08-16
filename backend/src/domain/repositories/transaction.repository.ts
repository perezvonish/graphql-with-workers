export interface TransactionRepository {
  executeInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
