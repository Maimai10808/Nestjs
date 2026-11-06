import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import {
  Throttle,
} from '@nestjs/throttler';

import { AgentsService } from './agents.service.js';

import { ResearchDto } from './dto/research.dto.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 查询 Agent 列表
  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  // 执行 AI 研究
  @Post('research')
  @Throttle({
    short: {
      ttl: 1000,
      limit: 1,
    },
    medium: {
      ttl: 10000,
      limit: 5,
    },
    long: {
      ttl: 60000,
      limit: 10,
    },
  })
  research(
    @Body() dto: ResearchDto,
  ) {
    return this.agentsService.research(
      dto.topic,
    );
  }

  // 查询 Agent 详情
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.findOne(id);
  }
}
