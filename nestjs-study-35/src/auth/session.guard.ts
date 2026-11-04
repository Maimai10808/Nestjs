import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request>();

    const userId = request.session?.userId;

    if (typeof userId !== 'number') {
      throw new UnauthorizedException(
        '请先登录',
      );
    }

    return true;
  }
}
