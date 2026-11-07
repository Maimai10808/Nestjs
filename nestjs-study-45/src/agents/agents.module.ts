import { Module } from '@nestjs/common';

import { AgentsService } from './agents.service.js';

import { AgentsGateway } from './agents.gateway.js';

@Module({
  providers: [
    AgentsService,
    AgentsGateway,
  ],
})
export class AgentsModule {}
