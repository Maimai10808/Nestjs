import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { TasksService } from './tasks.service.js';

import { AgentTaskStatus } from './entities/agent-task.entity.js';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  // GET /tasks
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // GET /tasks/1
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.findOne(id);
  }

  // POST /tasks
  @Post()
  create(
    @Body()
    body: {
      agentId: number;
      input: string;
    },
  ) {
    return this.tasksService.create(
      body.agentId,
      body.input,
    );
  }

  // PATCH /tasks/1/status
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      status: AgentTaskStatus;
      output?: string;
    },
  ) {
    return this.tasksService.updateStatus(
      id,
      body.status,
      body.output,
    );
  }

  // DELETE /tasks/1
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.remove(id);
  }
}
