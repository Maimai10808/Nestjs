import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { CacheInvalidationService } from '../cache/cache-invalidation.service.js';

@Controller('cache')
export class CacheAdminController {
  constructor(
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  // 清除公开 Agent 列表缓存
  @Delete('agents')
  async clearAgentList() {
    await this.cacheInvalidation.invalidatePublicAgents();

    return {
      message: '公开 Agent 列表缓存已清除',
    };
  }

  // 清除指定 Agent 详情缓存
  @Delete('agents/:id')
  async clearAgentDetail(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.cacheInvalidation.invalidateAgentDetail(id);

    return {
      message: `Agent ${id} 的缓存已清除`,
    };
  }
}
