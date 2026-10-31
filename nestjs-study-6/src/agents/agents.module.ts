import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';

import { LoggingInterceptor } from '../common/interceptors/logging.interceptor.js';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor.js';
import { CacheInterceptor } from '../common/interceptors/cache.interceptor.js';
import { TimeoutInterceptor } from '../common/interceptors/timeout.interceptor.js';

@Module({
  controllers: [AgentsController],

  providers: [
    AgentsService,

    // 注册拦截器，使 NestJS 可以管理和注入它们
    LoggingInterceptor,
    TransformInterceptor,
    CacheInterceptor,
    TimeoutInterceptor,
  ],

  exports: [AgentsService],
})
export class AgentsModule {}
