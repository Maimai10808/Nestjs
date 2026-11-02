import { Module } from '@nestjs/common';

import { AgentsModule } from './agents/agents.module.js';
import { TenantModule } from './tenant/tenant.module.js';

@Module({
  imports: [AgentsModule, TenantModule],
})
export class AppModule {}
