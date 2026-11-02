import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import type { Observable } from 'rxjs';
import type { Request } from 'express';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    const method = request.method;
    const url = request.url;

    console.log(`[Before] ${method} ${url}`);

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          console.log(`[After] ${method} ${url} - ${Date.now() - start}ms`);
        },
        error: (error: unknown) => {
          console.log(
            `[Error] ${method} ${url} - ${Date.now() - start}ms`,
            error,
          );
        },
      }),
    );
  }
}
