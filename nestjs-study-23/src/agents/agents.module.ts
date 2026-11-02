import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';

import { AgentsService } from './agents.service.js';

import { AgentCacheInterceptor } from '../cache/interceptors/agent-cache.interceptor.js';

@Module({
  controllers: [
    AgentsController,
  ],

  providers: [
    AgentsService,
    AgentCacheInterceptor,
  ],

  exports: [
    AgentsService,
  ],
})
export class AgentsModule {}
