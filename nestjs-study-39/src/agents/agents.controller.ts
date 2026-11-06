import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';

import type { Request } from 'express';

import { AgentsService } from './agents.service.js';

import { Public } from '../auth/public.decorator.js';

import type {
  AuthenticatedUser,
} from '../auth/jwt-payload.interface.js';

type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 1. 公开 Agent 目录
  @Public()
  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  // 2. 当前用户的 Agent
  @Get('my')
  findMyAgents(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.agentsService.findMyAgents(
      request.user.sub,
    );
  }

  // 3. 查询指定 Agent
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.agentsService.findOne(
      id,
      request.user.sub,
    );
  }

  // 4. 执行指定 Agent
  @Post(':id/run')
  runAgent(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.agentsService.runAgent(
      id,
      request.user.sub,
    );
  }
}
