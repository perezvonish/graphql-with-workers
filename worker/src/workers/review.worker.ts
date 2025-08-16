import { createClient } from 'redis';
import { BaseWorker } from '../types';
import { v4 } from 'uuid';
import { AddReviewType } from '../types/add-review.type';
import { getReviewById, updateReviewWithStatus } from '../services';
import Filter from 'bad-words';

export class ReviewWorker extends BaseWorker {
  name: string;
  private redis = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
    password: process.env.REDIS_PASSWORD,
  });

  private readonly filter = new Filter();

  constructor() {
    super();
    this.name = v4();
  }

  override async stop() {
    await this.redis.quit();
    await super.stop();
  }

  protected async run(): Promise<void> {
    await this.redis.connect();

    while (this.isRunning) {
      const keys = await this.redis.keys('bull:review-events:review-created:*');

      for (const key of keys) {
        const lockKey = `lock:${key}`;

        const locked = await this.redis.set(lockKey, this.name, {
          NX: true,
          PX: 60_000,
        });

        if (!locked) {
          continue;
        }

        const data = await this.redis.hGetAll(key);
        if (!data || data.processed === 'true') continue;

        const payload: AddReviewType = JSON.parse(data.data);

        const {reviewId, type, outboxId} = payload
        if (!reviewId) {
          console.warn(`[${this.name}] No reviewId in ${key}`);
          continue;
        }

        if (type !== "review.created") {
          console.warn(`[${this.name}] Not review.created event in ${key}`);
          continue;
        }

        try {
          const review = await getReviewById(reviewId);
          if (review) {
            const updatedText = `${this.filter.clean(review.text)} - Verified by Graphql-worker ${this.name.split("-")[0]}... 🤖`

            await updateReviewWithStatus(reviewId, updatedText, outboxId);

            console.log(`[${this.name}] Updated ${reviewId}`);
          } else {
            console.warn(`[${this.name}] Review ${reviewId} not found`);
          }

          await this.redis.hSet(key, { processed: 'true' });
        } catch (err) {
          console.error(`[${this.name}] Error processing ${reviewId}:`, err);
        } finally {
          const currentLockHolder = await this.redis.get(lockKey);
          if (currentLockHolder === this.name) {
            await this.redis.del(lockKey);
          }
        }
      }

      await new Promise((res) => setTimeout(res, 1000));
    }
  }
}
