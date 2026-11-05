import { Module } from '@nestjs/common';
import { AgentsModule } from '../agents/agents.module.js';
import { AgentSchedulerService } from './agent-scheduler.service.js';
import { SchedulesController } from './schedules.controller.js';
import { SchedulesService } from './schedules.service.js';

@Module({
  imports: [AgentsModule],
  controllers: [SchedulesController],
  providers: [AgentSchedulerService, SchedulesService],
})
export class SchedulesModule {}
