import {
  Injectable,
  ExecutionContext,
} from '@nestjs/common';

import {
  CacheInterceptor,
} from '@nestjs/cache-manager';

import { CacheKeys } from '../cache-keys.js';

import type { Request } from 'express';

@Injectable()
export class AgentCacheInterceptor extends CacheInterceptor {
  trackBy(
    context: ExecutionContext,
  ): string | undefined {
    const request = context
      .switchToHttp()
      .getRequest<Request>();

    // 只缓存 GET 请求
    if (request.method !== 'GET') {
      return undefined;
    }

    // 公开 Agent 列表
    if (request.path === '/agents') {
      return CacheKeys.publicAgents();
    }

    // Agent 详情
    const match = request.path.match(
      /^\/agents\/(\d+)$/,
    );

    if (match) {
      return CacheKeys.agentDetail(
        Number(match[1]),
      );
    }

    return undefined;
  }
}
