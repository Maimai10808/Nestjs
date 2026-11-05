import { ParseDatabaseIdPipe } from '../common/pipes/parse-database-id.pipe.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { TasksService } from './tasks.service.js';


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
    @Param('id', ParseDatabaseIdPipe) id: number,
  ) {
    return this.tasksService.findOne(id);
  }

  // POST /tasks
  @Post()
  create(
    @Body()
    body: CreateTaskDto,
  ) {
    return this.tasksService.create(
      body.agentId,
      body.input,
    );
  }

  // PATCH /tasks/1/status
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseDatabaseIdPipe) id: number,
    @Body()
    body: UpdateTaskStatusDto,
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
    @Param('id', ParseDatabaseIdPipe) id: number,
  ) {
    return this.tasksService.remove(id);
  }
}
