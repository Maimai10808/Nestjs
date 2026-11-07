import {
  ArgumentsHost,
  Catch,
  Logger,
} from '@nestjs/common';

import {
  BaseWsExceptionFilter,
  WsException,
} from '@nestjs/websockets';

import type { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter
  extends BaseWsExceptionFilter
{
  private readonly logger = new Logger(
    WsExceptionFilter.name,
  );

  override catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const client = host
      .switchToWs()
      .getClient<Socket>();

    if (exception instanceof WsException) {
      const error = exception.getError();

      const message =
        typeof error === 'string'
          ? error
          : typeof error === 'object' &&
              error !== null &&
              'message' in error
            ? String(error.message)
            : 'WebSocket 请求失败';

      client.emit('exception', {
        status: 'error',
        code: 'WS_ERROR',
        message,
        timestamp: new Date().toISOString(),
      });

      return;
    }

    this.logger.error(
      'WebSocket 未处理异常',
      exception instanceof Error
        ? exception.stack
        : String(exception),
    );

    client.emit('exception', {
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误',
      timestamp: new Date().toISOString(),
    });
  }
}
