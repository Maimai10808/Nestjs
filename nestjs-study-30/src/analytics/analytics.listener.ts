import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import {
  AgentCompletedEvent,
  AgentEventNames,
} from '../events/agent.events.js';

import { AnalyticsService } from './analytics.service.js';

@Injectable()
export class AnalyticsListener {
  private readonly logger = new Logger(
    AnalyticsListener.name,
  );

  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  @OnEvent(AgentEventNames.COMPLETED)
  handleAgentCompleted(
    event: AgentCompletedEvent,
  ) {
    this.analyticsService.recordExecution(
      event.userId,
      event.tokensUsed,
    );

    this.logger.log(
      `更新 Token 统计：userId=${event.userId}, tokens=${event.tokensUsed}`,
    );
  }
}
