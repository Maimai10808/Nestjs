import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  HttpException,
} from '@nestjs/common';

import {
  Observable,
  catchError,
  throwError,
} from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        // 已经是 HTTP 异常，保留原来的状态码
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        console.error('[ErrorsInterceptor]', error);

        // 教学示例：将未知异常映射为 502
        return throwError(
          () => new BadGatewayException('下游服务异常'),
        );
      }),
    );
  }
}
