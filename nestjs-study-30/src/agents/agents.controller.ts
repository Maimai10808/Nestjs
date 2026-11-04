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

  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  @Get('executions')
  findExecutions() {
    return this.agentsService.findExecutions();
  }

  @Post(':id/run')
  runAgent(
    @Param('id', ParseIntPipe) id: number,
  ) {
    // 教学项目使用固定用户
    const userId = 1001;

    return this.agentsService.runAgent(
      id,
      userId,
    );
  }
}
