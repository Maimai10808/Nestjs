import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';

import { AgentsService, type AgentTask } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Post('tasks')
  createTask(): AgentTask {
    return this.agentsService.createTask();
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string): AgentTask {
    const task = this.agentsService.findTask(id);

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    return task;
  }
}
