import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

import { AuthGuard } from '../auth/auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';

import { Roles } from '../auth/roles.decorator.js';
import { Public } from '../auth/public.decorator.js';

@Controller('agents')
@UseGuards(AuthGuard, RolesGuard)
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 公开接口：无需登录
  @Public()
  @Get('public')
  getPublicAgents() {
    return this.agentsService.findAll();
  }

  // 所有登录用户可以访问
  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  // 管理员与开发者可以访问
  @Post()
  @Roles(['admin', 'developer'])
  create() {
    return this.agentsService.create();
  }

  // 只有管理员可以删除
  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }

  // 所有登录用户可以查询
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }
}
