import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';

import { ChatService } from '../chat/chat.service.js';

@Module({
  controllers: [AgentsController],

  providers: [
    AgentsService,
    ChatService,
  ],
})
export class AgentsModule {}
