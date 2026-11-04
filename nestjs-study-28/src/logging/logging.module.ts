import { Module } from '@nestjs/common';

import { AppLogger } from './app-logger.service.js';
import { LogsService } from './logs.service.js';
import { LogsController } from './logs.controller.js';

@Module({
  controllers: [
    LogsController,
  ],

  providers: [
    AppLogger,
    LogsService,
  ],

  exports: [
    AppLogger,
    LogsService,
  ],
})
export class LoggingModule {}
