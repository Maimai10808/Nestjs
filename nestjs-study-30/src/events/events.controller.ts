import {
  Controller,
  Get,
} from '@nestjs/common';

import { EventsService } from './events.service.js';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Get('history')
  findAll() {
    return this.eventsService.findAll();
  }
}
