import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module.js';
import { AgentsModule } from './agents/agents.module.js';

@Module({
  imports: [
    UsersModule,
    AgentsModule,
  ],
})
export class AppModule {}
