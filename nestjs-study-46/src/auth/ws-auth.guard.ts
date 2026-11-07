import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { WsException } from '@nestjs/websockets';

import type { Socket } from 'socket.io';

import {
  AuthService,
  type CurrentUser,
} from './auth.service.js';

export type AuthenticatedSocket = Socket & {
  data: {
    user?: CurrentUser;
  };
};

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const client = context
      .switchToWs()
      .getClient<AuthenticatedSocket>();

    const token = client.handshake.auth?.token;

    const user =
      this.authService.validateToken(token);

    if (!user) {
      throw new WsException(
        '身份认证失败，请提供有效 Token',
      );
    }

    client.data.user = user;

    return true;
  }
}
