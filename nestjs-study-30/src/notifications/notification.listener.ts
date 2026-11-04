import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import {
  AgentCompletedEvent,
  AgentEventNames,
} from '../events/agent.events.js';

import { NotificationsService } from './notifications.service.js';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(
    NotificationListener.name,
  );

  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @OnEvent(AgentEventNames.COMPLETED)
  handleAgentCompleted(
    event: AgentCompletedEvent,
  ) {
    this.logger.log(
      `收到 Agent 完成事件：executionId=${event.executionId}`,
    );

    this.notificationsService.create(
      event.userId,
      'AI Agent 执行完成',
      `Agent ${event.agentId} 已完成任务`,
    );
  }
}
