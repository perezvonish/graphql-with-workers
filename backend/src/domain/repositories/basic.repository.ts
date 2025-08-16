export interface BasicRepository<T, K> {
  present(data: T): K;
  presentMany(data: T[]): K[];
}
