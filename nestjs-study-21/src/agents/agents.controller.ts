import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ParseArrayPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

import { CreateAgentDto } from './dto/create-agent.dto.js';
import { UpdateAgentDto } from './dto/update-agent.dto.js';
import { QueryAgentsDto } from './dto/query-agents.dto.js';
import { RunAgentDto } from './dto/run-agent.dto.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // ==============================
  // 创建 Agent
  // 学习：@Body + DTO 验证
  // ==============================

  @Post()
  create(
    @Body() dto: CreateAgentDto,
  ) {
    return this.agentsService.create(dto);
  }

  // ==============================
  // 查询 Agent 列表
  // 学习：@Query + DTO 转换
  // ==============================

  @Get()
  findAll(
    @Query() query: QueryAgentsDto,
  ) {
    return this.agentsService.findAll(query);
  }

  // ==============================
  // 根据多个 ID 查询
  // 学习：ParseArrayPipe
  // ==============================

  @Get('search/by-ids')
  findByIds(
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
        separator: ',',
      }),
    )
    ids: number[],
  ) {
    return this.agentsService.findByIds(ids);
  }

  // ==============================
  // 查询单个 Agent
  // 学习：ParseIntPipe
  // ==============================

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.agentsService.findOne(id);
  }

  // ==============================
  // 更新 Agent
  // 学习：PartialType
  // ==============================

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateAgentDto,
  ) {
    return this.agentsService.update(
      id,
      dto,
    );
  }

  // ==============================
  // 删除 Agent
  // ==============================

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.agentsService.remove(id);
  }

  // ==============================
  // 批量创建 Agent
  // 学习：ParseArrayPipe + DTO
  // ==============================

  @Post('bulk')
  createBulk(
    @Body(
      new ParseArrayPipe({
        items: CreateAgentDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    dtos: CreateAgentDto[],
  ) {
    return this.agentsService.createBulk(
      dtos,
    );
  }

  // ==============================
  // 执行 Agent
  // 学习：嵌套 DTO 验证
  // ==============================

  @Post(':id/run')
  @HttpCode(HttpStatus.OK)
  run(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: RunAgentDto,
  ) {
    return this.agentsService.run(
      id,
      dto,
    );
  }
}
