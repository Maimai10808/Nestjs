import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module.js';

import { AuthModule } from './auth/auth.module.js';

import { AgentsModule } from './agents/agents.module.js';

import { HealthModule } from './health/health.module.js';

@Module({
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
