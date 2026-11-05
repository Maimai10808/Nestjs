import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { AgentsModule } from './agents/agents.module.js';
import { ModelsModule } from './models/models.module.js';

@Module({
  imports: [
    CacheModule.register({
      // 注册为全局模块
      isGlobal: true,

      // 默认缓存 5 秒
      ttl: 5000,
    }),

    AgentsModule,
    ModelsModule,
  ],
})
export class AppModule {}
