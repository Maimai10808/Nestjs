import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';

import { SearchModule } from '../search/search.module.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [
    SearchModule,
    AiModule,
  ],

  controllers: [
    AgentsController,
  ],

  providers: [
    AgentsService,
  ],
})
export class AgentsModule {}
