import { Module } from '@nestjs/common';

import { AgentsModule } from './agents/agents.module.js';
import { ReportsModule } from './reports/reports.module.js';

@Module({
  imports: [
    AgentsModule,
    ReportsModule,
  ],
})
export class AppModule {}
