import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import {
  PERMISSIONS_KEY,
} from './permissions.decorator.js';

import {
  Permission,
} from './permission.enum.js';

import {
  Role,
} from './role.enum.js';

import {
  ROLE_PERMISSIONS,
} from './role-permissions.js';

@Injectable()
export class PermissionsGuard
  implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<
        Permission[]
      >(
        PERMISSIONS_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{
        user?: {
          sub: number;
          role: Role;
        };
      }>();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    const permissions =
      ROLE_PERMISSIONS[user.role] ?? [];

    return requiredPermissions.every(
      (permission) =>
        permissions.includes(permission),
    );
  }
}
