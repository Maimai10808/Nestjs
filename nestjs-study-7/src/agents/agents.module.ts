import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';

import { AuthGuard } from '../common/guards/auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Module({
  controllers: [AgentsController],

  providers: [
    AgentsService,
    AuthGuard,
    RolesGuard,
  ],

  exports: [AgentsService],
})
export class AgentsModule {}
