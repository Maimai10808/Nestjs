import { Module } from '@nestjs/common';

import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';
import { EventsListener } from './events.listener.js';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    EventsListener,
  ],
})
export class EventsModule {}
