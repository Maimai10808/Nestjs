import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { IsString, IsNotEmpty } from 'class-validator';

import { AgentService } from './agent.service.js';

export class ExecuteToolDto {
  @IsString()
  @IsNotEmpty()
  input: string;
}

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
  ) {}

  // 查看所有已注册工具
  @Get('tools')
  getTools() {
    return this.agentService.getAvailableTools();
  }

  // 执行指定工具
  @Post('tools/:name/execute')
  executeTool(
    @Param('name') name: string,
    @Body() dto: ExecuteToolDto,
  ) {
    return this.agentService.executeTool(
      name,
      dto.input,
    );
  }
}
