import { Injectable } from '@nestjs/common';

@Injectable()
export class AgentWorkerService {
  getHello(): string {
    return 'Hello World!';
  }
}
