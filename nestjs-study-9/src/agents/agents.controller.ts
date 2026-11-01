import {
  Controller,
  Get,
  Post,
  Param,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Post('tasks/:id')
  createTask(@Param('id') id: string) {
    return this.agentsService.createTask(id);
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string) {
    return this.agentsService.getTask(id);
  }
}
