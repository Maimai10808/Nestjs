import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import {
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/cache-manager';

import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 自动缓存公开 Agent 列表
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5000)
  findAll() {
    return this.agentsService.findAll();
  }

  // 自动缓存 Agent 详情
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.findOne(id);
  }

  // 创建 Agent
  @Post()
  create(
    @Body()
    data: {
      name: string;
      description: string;
      model: string;
    },
  ) {
    return this.agentsService.create(data);
  }

  // 修改 Agent
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,

    @Body()
    data: {
      name?: string;
      description?: string;
      model?: string;
    },
  ) {
    return this.agentsService.update(id, data);
  }
}
