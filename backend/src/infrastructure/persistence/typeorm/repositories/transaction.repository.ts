import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionRepository } from '../../../../domain/repositories';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(private readonly dataSource: DataSource) {}

  async executeInTransaction<T>(work: () => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      return work();
    });
  }
}
