import { Module } from '@nestjs/common';

import { AppLogger } from './app-logger.service.js';
import { LogsService } from './logs.service.js';

@Module({
  providers: [AppLogger, LogsService],

  exports: [AppLogger, LogsService],
})
export class LoggingModule {}
