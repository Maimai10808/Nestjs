import { Module } from '@nestjs/common';

import { ProviderLabController } from './provider-lab.controller.js';

import { SingletonService } from './scope/singleton.service.js';
import { RequestService } from './scope/request.service.js';
import { TransientService } from './scope/transient.service.js';

import { ConfigService } from './custom/config.service.js';

import {
  APP_CONFIG,
  type AppConfig,
} from './custom/tokens.js';

import { NotificationService } from './optional/notification.service.js';

@Module({
  controllers: [ProviderLabController],

  providers: [
    SingletonService,
    RequestService,
    TransientService,

    // 自定义 Provider：useValue
    {
      provide: APP_CONFIG,
      useValue: {
        appName: 'NestJS Provider Lab',
        environment: 'development',
        version: '1.0.0',
      } satisfies AppConfig,
    },

    ConfigService,
    NotificationService,

    // 注意：
    // 这里故意不注册 EMAIL_CLIENT，
    // 用于测试 @Optional()。
  ],
})
export class ProviderLabModule {}
