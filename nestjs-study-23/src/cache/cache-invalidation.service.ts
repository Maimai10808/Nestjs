import { Inject, Injectable } from '@nestjs/common';

import {
  CACHE_MANAGER,
  type Cache,
} from '@nestjs/cache-manager';

import { CacheKeys } from './cache-keys.js';

@Injectable()
export class CacheInvalidationService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 清除公开 Agent 列表
  async invalidatePublicAgents(): Promise<void> {
    await this.cacheManager.del(
      CacheKeys.publicAgents(),
    );
  }

  // 清除指定 Agent 详情
  async invalidateAgentDetail(
    agentId: number,
  ): Promise<void> {
    await this.cacheManager.del(
      CacheKeys.agentDetail(agentId),
    );
  }

  // 清除用户个人 Agent 列表
  async invalidateUserAgents(
    userId: number,
  ): Promise<void> {
    await this.cacheManager.del(
      CacheKeys.userAgents(userId),
    );
  }

  // Agent 发生修改时，统一清除相关缓存
  async invalidateAgent(
    agentId: number,
    userId: number,
  ): Promise<void> {
    await Promise.all([
      this.invalidatePublicAgents(),
      this.invalidateAgentDetail(agentId),
      this.invalidateUserAgents(userId),
    ]);
  }
}
