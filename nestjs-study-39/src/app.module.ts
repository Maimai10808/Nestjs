import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module.js';

import { AuthModule } from './auth/auth.module.js';

import { AgentsModule } from './agents/agents.module.js';

import { HealthModule } from './health/health.module.js';

@Module({
  providers: [{ provide: APP_PIPE, useValue: new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }) }],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    UsersModule,

    AuthModule,

    AgentsModule,

    HealthModule,
  ],
})
export class AppModule {}
