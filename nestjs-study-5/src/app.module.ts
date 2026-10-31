import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module.js';
import { AgentsModule } from './agents/agents.module.js';

@Module({
  imports: [
    AuthModule,
    AgentsModule,
  ],
})
export class AppModule {}
