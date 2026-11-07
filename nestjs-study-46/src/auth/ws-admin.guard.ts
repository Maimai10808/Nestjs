import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { WsException } from '@nestjs/websockets';

import type {
  AuthenticatedSocket,
} from './ws-auth.guard.js';

@Injectable()
export class WsAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const client = context
      .switchToWs()
      .getClient<AuthenticatedSocket>();

    const user = client.data.user;

    if (!user) {
      throw new WsException(
        '用户尚未认证',
      );
    }

    if (user.role !== 'admin') {
      throw new WsException(
        '当前用户没有管理员权限',
      );
    }

    return true;
  }
}
