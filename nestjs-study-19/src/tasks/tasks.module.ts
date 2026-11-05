import { AgentsModule } from '../agents/agents.module.js';
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AgentTask } from './entities/agent-task.entity.js';

import { TasksService } from './tasks.service.js';

import { TasksController } from './tasks.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentTask]),
    AgentsModule,
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
