import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AgentsModule } from './agents/agents.module.js';
import { SchedulesModule } from './schedules/schedules.module.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    AgentsModule,

    SchedulesModule,
  ],
})
export class AppModule {}
