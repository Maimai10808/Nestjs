import {
  Injectable,
  Logger,
} from '@nestjs/common';

import {
  OnEvent,
} from '@nestjs/event-emitter';

import { EventsService } from './events.service.js';

@Injectable()
export class EventsListener {
  private readonly logger = new Logger(
    EventsListener.name,
  );

  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @OnEvent('agent.*')
  handleAgentEvent(
    payload: unknown,
  ) {
    this.logger.log(
      '捕获到 Agent 业务事件',
    );

    this.eventsService.record(
      'agent.*',
      payload,
    );
  }
}
