import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from './roles.decorator.js';
import { Role } from './role.enum.js';

interface AuthenticatedUser {
  sub: number;
  username: string;
  role: Role;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    // 1. 获取路由要求的角色
    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    // 2. 没有声明角色要求，直接通过
    if (!requiredRoles?.length) {
      return true;
    }

    // 3. 获取当前认证用户
    const request = context
      .switchToHttp()
      .getRequest<{
        user?: AuthenticatedUser;
      }>();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        '请先登录',
      );
    }

    // 4. 检查角色
    return requiredRoles.includes(user.role);
  }
}
