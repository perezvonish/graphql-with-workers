export abstract class BaseWorker {
  abstract name: string;
  protected isRunning = false;

  async start() {
    this.isRunning = true;
    console.log(`[${this.name}] Worker started.`);
    await this.run();
  }

  async stop() {
    this.isRunning = false;
    console.log(`[${this.name}] Worker stopped.`);
  }

  protected abstract run(): Promise<void>;
}
