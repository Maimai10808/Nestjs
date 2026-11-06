import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import type { Request } from 'express';

export interface AuthenticatedUser {
  sub: number;
  username: string;
}

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & {
        user?: AuthenticatedUser;
      }>();

    // 1. 获取 Authorization Header
    const authorization =
      request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        '缺少 Authorization Header',
      );
    }

    // 2. 提取 Bearer Token
    const [type, token, extra] =
      authorization.split(' ');

    if (
      type !== 'Bearer' ||
      !token ||
      extra !== undefined
    ) {
      throw new UnauthorizedException(
        'Bearer Token 格式错误',
      );
    }

    // 3. 验证 JWT
    try {
      const payload =
        await this.jwtService.verifyAsync<
          AuthenticatedUser
        >(token);

      if (
        typeof payload.sub !== 'number' ||
        !Number.isSafeInteger(payload.sub) ||
        payload.sub <= 0 ||
        typeof payload.username !== 'string' ||
        payload.username.length === 0
      ) {
        throw new Error(
          'JWT Payload 无效',
        );
      }

      // 4. 保存认证用户
      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        'Token 无效或已过期',
      );
    }
  }
}
