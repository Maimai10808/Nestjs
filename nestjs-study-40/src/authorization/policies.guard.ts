import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import {
  CHECK_POLICIES_KEY,
} from './check-policies.decorator.js';

import type {
  PolicyHandler,
} from './policy-handler.interface.js';

import {
  CaslAbilityFactory,
} from './casl-ability.factory.js';

import type {
  AppAbility,
} from './casl-ability.factory.js';

import { Role } from './role.enum.js';

interface AuthenticatedUser {
  sub: number;
  username: string;
  role: Role;
}

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    private readonly caslAbilityFactory:
      CaslAbilityFactory,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    // 1. 读取当前路由的授权策略
    const handlers =
      this.reflector.getAllAndOverride<
        PolicyHandler[]
      >(
        CHECK_POLICIES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      ) ?? [];

    // 没有声明策略时，不额外限制
    if (handlers.length === 0) {
      return true;
    }

    // 2. 获取认证用户
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

    // 3. 根据用户创建 Ability
    const ability =
      this.caslAbilityFactory.createForUser({
        id: user.sub,
        role: user.role,
      });

    // 4. 执行全部策略
    return handlers.every((handler) =>
      this.executeHandler(handler, ability),
    );
  }

  private executeHandler(
    handler: PolicyHandler,
    ability: AppAbility,
  ): boolean {
    if (typeof handler === 'function') {
      return handler(ability);
    }

    return handler.handle(ability);
  }
}
