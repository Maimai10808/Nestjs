import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== 'study-secret-key') {
      throw new UnauthorizedException('API Key 无效');
    }

    console.log('[ApiKeyMiddleware] 验证通过');

    next();
  }
}
