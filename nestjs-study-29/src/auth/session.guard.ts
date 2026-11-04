import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';

import { AuthService } from './auth.service.js';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request>();

    const sessionId = request.cookies?.session_id;

    if (typeof sessionId !== 'string') {
      throw new UnauthorizedException('请先登录');
    }

    const user =
      this.authService.getCurrentUser(sessionId);

    // 将已验证用户附加到当前请求
    Object.assign(request, {
      user,
    });

    return true;
  }
}
