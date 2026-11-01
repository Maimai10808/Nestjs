import { Module } from '@nestjs/common';

import { AgentController } from './agent.controller.js';
import { AgentService } from './agent.service.js';

import { ToolsModule } from '../tools/tools.module.js';

@Module({
  imports: [ToolsModule],

  controllers: [AgentController],

  providers: [AgentService],
})
export class AgentModule {}
