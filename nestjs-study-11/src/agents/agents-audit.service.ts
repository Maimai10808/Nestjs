import { Injectable } from '@nestjs/common';

import { LoggerService } from '../common/logger.service.js';

@Injectable()
export class AgentsAuditService {
  constructor(
    private readonly logger: LoggerService,
  ) {}

  getLoggerInfo() {
    this.logger.log('执行 Agent 审计');

    return this.logger.getInfo();
  }
}
