import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

import { Roles } from '../common/decorators/roles.decorator.js';

import { RolesGuard } from '../common/guards/roles.guard.js';

import { ContextInterceptor } from '../common/interceptors/context.interceptor.js';

@Controller('agents')
@Roles(['user'])
@UseGuards(RolesGuard)
@UseInterceptors(ContextInterceptor)
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // ==========================================
  // 1. 普通用户可以查看 Agent
  // ==========================================

  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  // ==========================================
  // 2. 普通用户可以创建 Agent
  // ==========================================

  @Post()
  create(
    @Body('name') name: string,
  ) {
    return this.agentsService.create(name);
  }

  // ==========================================
  // 3. 管理员可以删除 Agent
  // ==========================================

  @Delete(':id')
  @Roles(['admin'])
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.remove(id);
  }
}
