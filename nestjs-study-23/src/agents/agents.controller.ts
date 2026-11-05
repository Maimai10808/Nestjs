import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CacheTTL } from '@nestjs/cache-manager';

import { UpdateAgentDto } from './dto/update-agent.dto.js';
import { AgentsService } from './agents.service.js';

import { AgentCacheInterceptor } from '../cache/interceptors/agent-cache.interceptor.js';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  // 获取公开 Agent 列表
  @Get()
  @UseInterceptors(AgentCacheInterceptor)
  @CacheTTL(5000)
  findAll() {
    return this.agentsService.findAll();
  }

  // 获取指定 Agent 详情
  @Get(':id')
  @UseInterceptors(AgentCacheInterceptor)
  @CacheTTL(10000)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.findOne(id);
  }

  // 修改 Agent
  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,

    @Body()
    data: UpdateAgentDto,
  ) {
    return this.agentsService.update(id, data);
  }

  // 删除 Agent
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.remove(id);
  }
}
