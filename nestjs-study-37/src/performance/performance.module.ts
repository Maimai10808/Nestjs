import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { PerformanceController } from './performance.controller.js';

import { PerformanceService } from './performance.service.js';

import { LoggerMiddleware } from './logger.middleware.js';

@Module({
  controllers: [
    PerformanceController,
  ],
  providers: [
    PerformanceService,
  ],
})
export class PerformanceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({
        path: 'performance/*path',
        method: RequestMethod.ALL,
      });
  }
}
