import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import {
  AgentCompletedEvent,
  AgentFailedEvent,
  AgentEventNames,
} from '../events/agent.events.js';

import { AuditService } from './audit.service.js';

@Injectable()
export class AuditListener {
  private readonly logger = new Logger(
    AuditListener.name,
  );

  constructor(
    private readonly auditService: AuditService,
  ) {}

  // Agent 执行成功
  @OnEvent(AgentEventNames.COMPLETED)
  handleAgentCompleted(
    event: AgentCompletedEvent,
  ) {
    this.auditService.record(
      event.executionId,
      event.userId,
      event.agentId,
      AgentEventNames.COMPLETED,
      `Agent 执行成功，消耗 ${event.tokensUsed} Tokens`,
    );

    this.logger.log(
      `记录 Agent 成功审计：executionId=${event.executionId}`,
    );
  }

  // Agent 执行失败
  @OnEvent(AgentEventNames.FAILED)
  handleAgentFailed(
    event: AgentFailedEvent,
  ) {
    this.auditService.record(
      event.executionId,
      event.userId,
      event.agentId,
      AgentEventNames.FAILED,
      `Agent 执行失败：${event.reason}`,
    );

    this.logger.warn(
      `记录 Agent 失败审计：executionId=${event.executionId}`,
    );
  }
}
