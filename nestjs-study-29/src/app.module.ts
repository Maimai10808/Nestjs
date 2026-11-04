import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module.js';
import { AgentsModule } from './agents/agents.module.js';
import { CookiesModule } from './cookies/cookies.module.js';

@Module({
  imports: [
    AuthModule,
    AgentsModule,
    CookiesModule,
  ],
})
export class AppModule {}
