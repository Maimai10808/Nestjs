import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AgentTask } from './entities/agent-task.entity.js';

import { TasksService } from './tasks.service.js';

import { TasksController } from './tasks.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentTask]),
  ],

  controllers: [
    TasksController,
  ],

  providers: [
    TasksService,
  ],

  exports: [
    TasksService,
  ],
})
export class TasksModule {}
