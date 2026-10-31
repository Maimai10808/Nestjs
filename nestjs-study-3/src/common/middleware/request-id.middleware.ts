import { randomUUID } from 'node:crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = randomUUID();

    // 将 Request ID 写入请求对象
    req.headers['x-request-id'] = requestId;

    // 同时写入响应头
    res.setHeader('X-Request-ID', requestId);

    console.log('[RequestIdMiddleware]', requestId);

    next();
  }
}
