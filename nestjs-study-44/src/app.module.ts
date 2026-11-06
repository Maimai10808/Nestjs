import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import {
  ConfigModule,
} from '@nestjs/config';

import {
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';

import { AgentsModule } from './agents/agents.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ModelsModule } from './models/models.module.js';
import { RateLimitModule } from './rate-limit/rate-limit.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    AuthModule,
    AgentsModule,
    ModelsModule,
    RateLimitModule,
    HealthModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
