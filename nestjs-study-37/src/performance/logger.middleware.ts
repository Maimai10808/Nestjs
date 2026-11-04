import {
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';

import type {
  IncomingMessage,
  ServerResponse,
} from 'node:http';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(
    LoggerMiddleware.name,
  );

  use(
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
  ) {
    const startTime = performance.now();

    this.logger.log(
      `收到请求：${req.method} ${req.url}`,
    );

    res.once('finish', () => {
      const durationMs = Math.round(
        performance.now() - startTime,
      );

      this.logger.log(
        `请求完成：${req.method} ${req.url} ` +
          `status=${res.statusCode} ` +
          `duration=${durationMs}ms`,
      );
    });

    next();
  }
}
