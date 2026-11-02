import {
  Controller,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // ==========================================
  // 1. 获取 Agent 执行配置
  // ==========================================

  @Get('config')
  getConfig() {
    return this.agentsService.getConfig();
  }

  // ==========================================
  // 2. 执行 Agent
  // ==========================================

  @Post('run')
  async runAgent(
    @Body('prompt') prompt: string,
  ) {
    return this.agentsService.run(prompt);
  }

  // ==========================================
  // 3. 获取 Agent 执行限制
  // ==========================================

  @Get('limits')
  getLimits() {
    return this.agentsService.getLimits();
  }
}
