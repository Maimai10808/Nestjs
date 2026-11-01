import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const controllerName = context.getClass().name;

    const handlerName = context.getHandler().name;

    const start = Date.now();

    console.log(
      `[Interceptor] ${controllerName}.${handlerName} 开始执行`,
    );

    return next.handle().pipe(
      tap(() => {
        console.log(
          `[Interceptor] ${controllerName}.${handlerName} 执行完成`,
        );

        console.log(
          `耗时: ${Date.now() - start}ms`,
        );
      }),
    );
  }
}
