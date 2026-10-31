import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();

    res.on('finish', () => {
      const duration = performance.now() - start;

      console.log(
        `[TimingMiddleware] ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`,
      );
    });

    next();
  }
}
