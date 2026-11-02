import {
  Injectable,
  ExecutionContext,
} from '@nestjs/common';

import { CacheInterceptor } from '@nestjs/cache-manager';

import type { Request } from 'express';

import { CacheKeys } from '../cache-keys.js';

@Injectable()
export class UserCacheInterceptor extends CacheInterceptor {
  trackBy(
    context: ExecutionContext,
  ): string | undefined {
    const request = context
      .switchToHttp()
      .getRequest<Request>();

    if (request.method !== 'GET') {
      return undefined;
    }

    if (request.path !== '/users/me/agents') {
      return undefined;
    }

    const rawUserId = request.headers['x-demo-user-id'];

    if (
      typeof rawUserId !== 'string' ||
      !/^[1-9]\d*$/.test(rawUserId)
    ) {
      return undefined;
    }

    const userId = Number(rawUserId);

    if (!Number.isSafeInteger(userId)) {
      return undefined;
    }

    return CacheKeys.userAgents(userId);
  }
}
