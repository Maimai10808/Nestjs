import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Agent } from './entities/agent.entity.js';

import { AgentsController } from './agents.controller.js';

import { AgentsService } from './agents.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent]),
  ],

  controllers: [
    AgentsController,
  ],

  providers: [
    AgentsService,
  ],

  exports: [
    AgentsService,
  ],
})
export class AgentsModule {}
