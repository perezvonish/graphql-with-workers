import 'dotenv/config';
import { WorkerFactory } from './worker-factory';

async function bootstrap() {
  const factory = new WorkerFactory();

  factory.register(Number(process.env.WORKER_COUNT))

  await factory.startAll();

  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await factory.stopAll();
    process.exit(0);
  });
}

bootstrap();
