import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { Role } from '../decorators/roles.decorator.js';

interface DemoUser {
  id: number;
  role: Role;
}

export type DemoRequest = Request & { user?: DemoUser };

// 仅供本地教学：固定 Token 不是 JWT，不具备签名、过期和撤销机制。
const usersByToken = new Map<string, DemoUser>([
  ['demo-user-token', { id: 1, role: 'user' }],
  ['demo-admin-token', { id: 2, role: 'admin' }],
]);

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<DemoRequest>();
    const token = request.headers.authorization?.match(/^Bearer (\S+)$/i)?.[1];
    const user = token ? usersByToken.get(token) : undefined;

    if (!user) {
      throw new UnauthorizedException('需要有效的教学 Token');
    }

    // 身份由服务端映射产生，不信任客户端 x-role / body.role。
    request.user = { ...user };
    return true;
  }
}
