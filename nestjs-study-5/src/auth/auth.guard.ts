import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { AuthService } from './auth.service.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';
import type { AuthUser } from './auth.types.js';

interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 判断当前接口是否允许公开访问
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (isPublic) {
      return true;
    }

    // 2. 获取当前 HTTP 请求
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    // 3. 读取 Authorization 请求头
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('缺少 Authorization');
    }

    // 4. 提取 Bearer Token
    const [type, token, ...extra] = authorization.split(' ');

    if (
      type !== 'Bearer' ||
      !token ||
      extra.length > 0
    ) {
      throw new UnauthorizedException('Token 格式错误');
    }

    // 5. 验证 Token
    const user = this.authService.validateToken(token);

    if (!user) {
      throw new UnauthorizedException('Token 无效');
    }

    // 6. 将用户信息附加到 Request
    request.user = user;

    return true;
  }
}
