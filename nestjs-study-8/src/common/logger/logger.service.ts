import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly instanceId = Math.random();

  log(message: string): void {
    console.log(`[Logger ${this.instanceId}] ${message}`);
  }

  getInstanceId(): number {
    return this.instanceId;
  }
}
