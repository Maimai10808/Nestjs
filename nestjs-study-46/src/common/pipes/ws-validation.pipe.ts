import {
  Injectable,
  ValidationPipe,
} from '@nestjs/common';

import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,

      exceptionFactory: (errors) => {
        return new WsException({
          code: 'VALIDATION_ERROR',

          message: 'WebSocket 消息参数不合法',

          details: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      },
    });
  }
}
