import { Injectable } from '@nestjs/common';

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  createdAt: string;
}

@Injectable()
export class NotificationsService {
  private readonly notifications: Notification[] = [];

  private nextId = 1;

  create(
    userId: number,
    title: string,
    message: string,
  ): Notification {
    const notification: Notification = {
      id: this.nextId++,
      userId,
      title,
      message,
      createdAt: new Date().toISOString(),
    };

    this.notifications.push(notification);

    return notification;
  }

  findAll(): Notification[] {
    return this.notifications;
  }
}
