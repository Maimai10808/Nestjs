import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {
    console.log('AgentsController 被创建');
  }

  @Get('run')
  run(
    @Query('prompt') prompt = 'Hello NestJS',
  ) {
    return this.agentsService.run(prompt);
  }
}
