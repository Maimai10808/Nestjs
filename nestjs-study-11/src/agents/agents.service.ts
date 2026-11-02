import { Injectable } from '@nestjs/common';

import { SingletonService } from '../common/singleton.service.js';
import { RequestContextService } from '../common/request-context.service.js';
import { LoggerService } from '../common/logger.service.js';

import { AgentsAuditService } from './agents-audit.service.js';

@Injectable()
export class AgentsService {
  constructor(
    private readonly singleton: SingletonService,

    private readonly requestContext: RequestContextService,

    private readonly logger: LoggerService,

    private readonly auditService: AgentsAuditService,
  ) {
    console.log('AgentsService 被创建');
  }

  run(prompt: string) {
    this.logger.log('执行 Agent 请求');

    return {
      prompt,

      singleton: this.singleton.getInfo(),

      request: this.requestContext.getInfo(),

      logger: this.logger.getInfo(),

      auditLogger: this.auditService.getLoggerInfo(),
    };
  }
}
