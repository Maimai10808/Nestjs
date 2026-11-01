import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Post('tasks')
  createTask() {
    return this.agentsService.createTask();
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string) {
    const task = this.agentsService.findTask(id);

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    return task;
  }
}
