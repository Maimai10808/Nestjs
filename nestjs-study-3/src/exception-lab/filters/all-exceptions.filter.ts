import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(
    AllExceptionsFilter.name,
  );

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const request = ctx.getRequest();

    const response = ctx.getResponse();

    // 判断是不是 NestJS HTTP 异常
    const isHttpException =
      exception instanceof HttpException;

    // 确定状态码
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 获取异常内容
    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : null;

    // 提取错误消息
    const message = isHttpException
      ? typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse
      : 'Internal server error';

    // 未知异常记录完整错误信息
    if (!isHttpException) {
      this.logger.error(
        '发生未处理异常',
        exception instanceof Error
          ? exception.stack
          : String(exception),
      );
    }

    // 返回统一响应
    httpAdapter.reply(
      response,
      {
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(request),
      },
      statusCode,
    );
  }
}
