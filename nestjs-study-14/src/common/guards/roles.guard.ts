import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Roles } from '../decorators/roles.decorator.js';
import type { DemoRequest } from './mock-auth.guard.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // ==========================================
    // 1. 获取当前执行上下文类型
    // ==========================================

    const contextType = context.getType();

    console.log('上下文类型:', contextType);

    // ==========================================
    // 2. 获取当前 Controller 类
    // ==========================================

    const controllerClass = context.getClass();

    console.log(
      'Controller:',
      controllerClass.name,
    );

    // ==========================================
    // 3. 获取当前执行的方法
    // ==========================================

    const handler = context.getHandler();

    console.log(
      'Handler:',
      handler.name,
    );

    // ==========================================
    // 4. 获取当前 HTTP 请求
    // ==========================================

    const request = context
      .switchToHttp()
      .getRequest<DemoRequest>();

    console.log('HTTP Method:', request.method);
    console.log('HTTP URL:', request.url);

    // ==========================================
    // 5. 读取角色元数据
    // ==========================================

    const requiredRoles =
      this.reflector.getAllAndOverride(Roles, [
        context.getHandler(),
        context.getClass(),
      ]);

    console.log(
      'Required Roles:',
      requiredRoles,
    );

    // 没有声明角色要求时直接放行
    if (!requiredRoles?.length) {
      return true;
    }

    // ==========================================
    // 6. 获取当前用户
    // ==========================================

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('缺少用户身份');
    }

    // ==========================================
    // 7. 判断用户角色
    // ==========================================

    const hasPermission = requiredRoles.includes(
      user.role,
    );

    if (!hasPermission) {
      throw new ForbiddenException('权限不足');
    }

    return true;
  }
}
