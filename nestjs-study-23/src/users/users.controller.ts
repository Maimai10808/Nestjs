import {
  BadRequestException,
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
  constructor(private readonly agentsService: AgentsService) {}

  @Get('me/agents')
  @UseInterceptors(UserCacheInterceptor)
  @CacheTTL(10000)
  async findMyAgents(@Headers('x-demo-user-id') rawUserId: string | undefined) {
    const userId = await new ParseIntPipe().transform(rawUserId, {
      type: 'custom',
      data: 'x-demo-user-id',
    });
    if (
      typeof userId !== 'number' ||
      !Number.isSafeInteger(userId) ||
      userId < 1
    ) {
      throw new BadRequestException('x-demo-user-id 必须是正整数');
    }
    return this.agentsService.findByUser(userId);
  }
}
