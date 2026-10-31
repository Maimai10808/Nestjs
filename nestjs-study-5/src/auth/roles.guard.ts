import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { Roles } from './roles.decorator.js';
import type { AuthUser } from './auth.types.js';

interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 读取当前路由需要的角色
    const requiredRoles = this.reflector.getAllAndOverride(
      Roles,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // 2. 没有设置角色限制
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3. 获取当前登录用户
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }

    // 4. 判断用户是否具有所需角色
    const hasPermission = requiredRoles.includes(user.role);

    if (!hasPermission) {
      throw new ForbiddenException('当前用户没有访问权限');
    }

    return true;
  }
}
