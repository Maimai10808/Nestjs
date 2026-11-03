import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';
import { AgentProcessor } from './agent.processor.js';
import { AgentQueueEventsListener } from './agent-queue-events.listener.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'agent-tasks',
    }),
  ],

  controllers: [AgentsController],

  providers: [
    AgentsService,
    AgentProcessor,
    AgentQueueEventsListener,
  ],

  exports: [AgentsService],
})
export class AgentsModule {}
