import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { AuthService } from '../auth.service.js';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

import type { AuthUser } from '../interfaces/auth-user.interface.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 读取当前路由的公开标记
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // 2. 公开接口直接放行
    if (isPublic) {
      return true;
    }

    // 3. 获取 HTTP Request
    const request = context.switchToHttp().getRequest<{
      headers: {
        authorization?: string;
      };
      user?: AuthUser;
    }>();

    // 4. 提取 Bearer Token
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('请先登录');
    }

    const token = authorization.slice(7);

    // 5. 验证 Token
    const user = this.authService.validateToken(token);

    if (!user) {
      throw new UnauthorizedException('Token 无效');
    }

    // 6. 将用户挂载到 Request
    request.user = user;

    return true;
  }
}
