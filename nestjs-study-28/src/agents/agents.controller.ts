import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 查询全部 Agent
  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  // 查询 Agent 执行记录
  @Get('executions')
  findExecutions() {
    return this.agentsService.findExecutions();
  }

  // 执行指定 Agent
  @Post(':id/run')
  runAgent(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.runAgent(id);
  }
}
