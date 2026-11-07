import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import {
  Observable,
  tap,
} from 'rxjs';

@Injectable()
export class WsLoggingInterceptor
  implements NestInterceptor
{
  private readonly logger = new Logger(
    WsLoggingInterceptor.name,
  );

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const eventName =
      context.getHandler().name;

    const startedAt = performance.now();

    this.logger.log(
      `WebSocket Handler 开始：${eventName}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Math.round(
            performance.now() - startedAt,
          );

          this.logger.log(
            `${eventName} 返回数据，耗时 ${duration}ms`,
          );
        },

        error: (error) => {
          this.logger.error(
            `${eventName} 执行失败`,
            error instanceof Error
              ? error.stack
              : undefined,
          );
        },

        complete: () => {
          this.logger.log(
            `${eventName} 执行结束`,
          );
        },
      }),
    );
  }
}
