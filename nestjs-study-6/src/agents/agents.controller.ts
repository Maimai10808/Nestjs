import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';
import { CreateAgentDto } from './dto/create-agent.dto.js';

import { LoggingInterceptor } from '../common/interceptors/logging.interceptor.js';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor.js';
import { CacheInterceptor } from '../common/interceptors/cache.interceptor.js';
import { TimeoutInterceptor } from '../common/interceptors/timeout.interceptor.js';
import { ErrorsInterceptor } from '../common/interceptors/errors.interceptor.js';

@Controller('agents')
@UseInterceptors(LoggingInterceptor)
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 1. 普通查询：日志 + 统一响应
  @Get()
  @UseInterceptors(TransformInterceptor)
  findAll() {
    return this.agentsService.findAll();
  }

  // 2. 缓存查询
  @Get('cached')
  @UseInterceptors(CacheInterceptor)
  findCached() {
    return this.agentsService.findAll();
  }

  // 3. 超时测试
  @Get('slow')
  @UseInterceptors(TimeoutInterceptor)
  findSlow() {
    return this.agentsService.findSlow();
  }

  // 4. 异常映射测试
  @Get('error')
  @UseInterceptors(ErrorsInterceptor)
  throwError() {
    return this.agentsService.throwError();
  }

  // 5. 查询单个 Agent
  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.findOne(id);
  }

  // 6. 创建 Agent
  @Post()
  @UseInterceptors(TransformInterceptor)
  create(
    @Body() dto: CreateAgentDto,
  ) {
    return this.agentsService.create(dto);
  }
}
