import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { SecurityModule } from './security/security.module.js';

import { UsersModule } from './users/users.module.js';

import { AuthModule } from './auth/auth.module.js';

import { ProvidersModule } from './providers/providers.module.js';

import { AgentsModule } from './agents/agents.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SecurityModule,

    UsersModule,

    AuthModule,

    ProvidersModule,

    AgentsModule,
  ],
})
export class AppModule {}
