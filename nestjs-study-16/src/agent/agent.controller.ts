import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { AgentService } from './agent.service.js';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('tools')
  getTools() {
    return this.agentService.getAvailableTools();
  }

  @Post('tools/:name/execute')
  executeTool(@Param('name') name: string, @Body('input') input: unknown) {
    // 本章聚焦工具发现；运行时显式校验，不依赖未安装的验证库。
    if (typeof input !== 'string' || !input.trim()) {
      throw new BadRequestException('input 必须是非空字符串');
    }

    return this.agentService.executeTool(name, input.trim());
  }
}
