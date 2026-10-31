import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';

import type {
  Request,
  Response,
} from 'express';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter
  implements ExceptionFilter<HttpException>
{
  catch(
    exception: HttpException,
    host: ArgumentsHost,
  ): void {
    // 1. 获取 HTTP 上下文
    const ctx = host.switchToHttp();

    // 2. 获取 Express Request
    const request = ctx.getRequest<Request>();

    // 3. 获取 Express Response
    const response = ctx.getResponse<Response>();

    // 4. 获取 HTTP 状态码
    const statusCode = exception.getStatus();

    // 5. 获取异常响应内容
    const exceptionResponse = exception.getResponse();

    // 6. 提取错误消息
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse;

    // 7. 记录错误
    console.error({
      statusCode,
      path: request.url,
      message,
    });

    // 8. 返回统一错误响应
    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
