import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable, of, tap } from 'rxjs';
import type { Request } from 'express';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, unknown>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    const key = `${request.method}:${request.url}`;

    if (this.cache.has(key)) {
      console.log('[Cache] 命中缓存');

      return of(this.cache.get(key));
    }

    console.log('[Cache] 未命中缓存');

    return next.handle().pipe(
      tap((data) => {
        // 保存快照，避免 Service 修改原数组时悄悄改变缓存。
        this.cache.set(key, structuredClone(data));
      }),
    );
  }
}
