import { BaseWorker } from './types';
import { ReviewWorker } from './workers/review.worker';

export class WorkerFactory {
  private workers: BaseWorker[] = [];

  register(count: number) {
    for (let i = 0; i < count; i++) {
      this.workers.push(new ReviewWorker());
    }

  }

  async startAll() {
    console.log(`[Factory] Count: ${this.workers.length}. Starting all workers...`);
    for (const worker of this.workers) {
      worker.start();
    }
  }

  async stopAll() {
    console.log('[Factory] Stopping all workers...');
    for (const worker of this.workers) {
      worker.stop();
    }
  }
}
