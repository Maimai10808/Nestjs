import { Module } from '@nestjs/common';

import { UsersController } from './users.controller.js';

import { AgentsModule } from '../agents/agents.module.js';

import { UserCacheInterceptor } from '../cache/interceptors/user-cache.interceptor.js';

@Module({
  imports: [
    AgentsModule,
  ],

  controllers: [
    UsersController,
  ],

  providers: [
    UserCacheInterceptor,
  ],
})
export class UsersModule {}
