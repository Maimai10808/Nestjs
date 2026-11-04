import { Module } from '@nestjs/common';

import { NotificationsController } from './notifications.controller.js';

import { NotificationsService } from './notifications.service.js';

import { NotificationListener } from './notification.listener.js';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationListener,
  ],
})
export class NotificationsModule {}
