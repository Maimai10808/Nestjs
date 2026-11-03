import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';
import { AgentEntity } from './entities/agent.entity.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 查询所有 Agent
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.agentsService.findAll();
  }

  // 查询指定 Agent
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.findOne(id);
  }

  // 使用 SerializeOptions 配置序列化
  @Get(':id/public')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  findPublic(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.findOne(id);
  }

  // 将普通对象转换为指定 Entity 后序列化
  @Get(':id/plain')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: AgentEntity,
  })
  findPlain(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.findOnePlain(id);
  }

  // 不使用序列化拦截器
  @Get(':id/raw')
  findRaw(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.findOne(id);
  }
}
