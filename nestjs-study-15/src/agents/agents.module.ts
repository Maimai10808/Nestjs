import { Module } from '@nestjs/common';

import { InfrastructureModule } from '../infrastructure/infrastructure.module.js';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';

@Module({
  imports: [InfrastructureModule],

  controllers: [AgentsController],

  providers: [AgentsService],
})
export class AgentsModule {}
