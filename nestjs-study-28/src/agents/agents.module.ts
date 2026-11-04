import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';

import { AiModule } from '../ai/ai.module.js';
import { LoggingModule } from '../logging/logging.module.js';

@Module({
  imports: [
    AiModule,
    LoggingModule,
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
