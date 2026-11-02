import {
  Controller,
  Get,
  Headers,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';

import { CacheTTL } from '@nestjs/cache-manager';

import { AgentsService } from '../agents/agents.service.js';

import { UserCacheInterceptor } from '../cache/interceptors/user-cache.interceptor.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Get('me/agents')
  @UseInterceptors(UserCacheInterceptor)
  @CacheTTL(10000)
  findMyAgents(
    @Headers('x-demo-user-id', ParseIntPipe)
    userId: number,
  ) {
    return this.agentsService.findByUser(userId);
  }
}
