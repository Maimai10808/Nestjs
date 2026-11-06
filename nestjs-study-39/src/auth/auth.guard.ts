import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { Reflector } from '@nestjs/core';

import type { Request } from 'express';

import {
  IS_PUBLIC_KEY,
} from './public.decorator.js';

import type {
  AuthenticatedUser,
} from './jwt-payload.interface.js';

type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // 1. 检查当前路由是否公开
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (isPublic) {
      return true;
    }

    // 2. 获取 HTTP Request
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    // 3. 提取 Bearer Token
    const token = this.extractTokenFromHeader(
      request,
    );

    if (!token) {
      throw new UnauthorizedException(
        '缺少身份认证 Token',
      );
    }

    // 4. 验证 JWT
    try {
      const payload =
        await this.jwtService.verifyAsync<AuthenticatedUser>(
          token,
        );

      // 5. 验证关键声明
      if (
        typeof payload.sub !== 'number' ||
        !Number.isSafeInteger(payload.sub) ||
        payload.sub < 1 ||
        typeof payload.username !== 'string' ||
        !['user', 'admin'].includes(payload.role)
      ) {
        throw new UnauthorizedException(
          'JWT Payload 无效',
        );
      }

      // 6. 保存当前认证用户
      request.user = payload;

      // 7. 允许请求继续执行
      return true;
    } catch {
      throw new UnauthorizedException(
        'Token 无效或已经过期',
      );
    }
  }

  private extractTokenFromHeader(
    request: Request,
  ): string | undefined {
    const authorization =
      request.headers.authorization;

    if (!authorization) {
      return undefined;
    }

    const [type, token, extra] =
      authorization.split(' ');

    if (
      type !== 'Bearer' ||
      !token ||
      extra !== undefined
    ) {
      return undefined;
    }

    return token;
  }
}
