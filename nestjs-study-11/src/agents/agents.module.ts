import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';
import { AgentsAuditService } from './agents-audit.service.js';

import { SingletonService } from '../common/singleton.service.js';
import { RequestContextService } from '../common/request-context.service.js';
import { LoggerService } from '../common/logger.service.js';

@Module({
  controllers: [
    AgentsController,
  ],

  providers: [
    AgentsService,
    AgentsAuditService,

    SingletonService,
    RequestContextService,
    LoggerService,
  ],
})
export class AgentsModule {}
