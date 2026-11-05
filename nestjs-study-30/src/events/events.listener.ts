import { Injectable, Logger } from '@nestjs/common';

import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';

import { EventsService } from './events.service.js';

@Injectable()
export class EventsListener {
  private readonly logger = new Logger(EventsListener.name);

  constructor(
    private readonly eventsService: EventsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('agent.*')
  handleAgentEvent(payload: unknown) {
    // 在任何异步操作前读取：下一次 emit 会覆盖 emitter.event。
    const event =
      'event' in this.eventEmitter ? this.eventEmitter.event : undefined;
    const eventName = typeof event === 'string' ? event : String(event);
    this.logger.log(`捕获到 Agent 业务事件：${eventName}`);

    this.eventsService.record(eventName, payload);
  }
}
