import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

import { ResearchDto } from './dto/research.dto.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 1. 查询 Agent 列表
  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  // 2. 执行 AI 研究任务
  @Post('research')
  research(
    @Body() dto: ResearchDto,
  ) {
    return this.agentsService.research(dto.topic);
  }

  // 3. 查询 Agent 详情
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.findOne(id);
  }
}
