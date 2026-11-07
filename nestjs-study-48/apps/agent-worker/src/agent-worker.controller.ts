import { Controller, Get } from '@nestjs/common';
import { AgentWorkerService } from './agent-worker.service.js';

@Controller()
export class AgentWorkerController {
  constructor(private readonly agentWorkerService: AgentWorkerService) {}

  @Get()
  getHello(): string {
    return this.agentWorkerService.getHello();
  }
}
