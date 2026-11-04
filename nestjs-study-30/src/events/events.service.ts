import { Injectable } from '@nestjs/common';

interface EventHistory {
  id: number;
  eventName: string;
  payload: unknown;
  createdAt: string;
}

@Injectable()
export class EventsService {
  private readonly events: EventHistory[] = [];

  private nextId = 1;

  record(
    eventName: string,
    payload: unknown,
  ): EventHistory {
    const event: EventHistory = {
      id: this.nextId++,
      eventName,
      payload,
      createdAt: new Date().toISOString(),
    };

    this.events.push(event);

    return event;
  }

  findAll(): EventHistory[] {
    return this.events;
  }
}
