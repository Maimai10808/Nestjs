import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Roles } from '../decorators/roles.decorator.js';

import type { AuthUser } from '../interfaces/auth-user.interface.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 获取当前路由需要的角色
    const requiredRoles = this.reflector.getAllAndOverride(
      Roles,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // 2. 没有角色要求，直接放行
    if (!requiredRoles?.length) {
      return true;
    }

    // 3. 获取当前登录用户
    const request = context.switchToHttp().getRequest<{
      user?: AuthUser;
    }>();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }

    // 4. 判断用户是否具有任意一个允许的角色
    const hasPermission = requiredRoles.some((role) =>
      user.roles.includes(role),
    );

    if (!hasPermission) {
      throw new ForbiddenException('权限不足');
    }

    return true;
  }
}
