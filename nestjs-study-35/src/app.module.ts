import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module.js';
import { AgentsModule } from './agents/agents.module.js';
import { SessionsModule } from './sessions/sessions.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,

    AgentsModule,

    SessionsModule,
  ],
})
export class AppModule {}
