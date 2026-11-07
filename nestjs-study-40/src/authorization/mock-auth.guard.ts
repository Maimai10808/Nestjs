import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../users/users.service.js';
import type { User } from '../users/user.interface.js';

// 公开的教学 Token，不提供密码认证、签名、过期或撤销能力。
const DEMO_IDENTITIES: Readonly<Record<string, number>> = {
  'demo-robin-token': 1001,
  'demo-alan-token': 1002,
  'demo-admin-token': 1003,
};

@Injectable()
export class MockAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user?: { sub: number; username: string; role: User['role'] } }>();
    const [scheme, token, extra] = request.headers.authorization?.split(' ') ?? [];
    const id = scheme === 'Bearer' && token && extra === undefined ? DEMO_IDENTITIES[token] : undefined;
    const user = id === undefined ? undefined : this.usersService.findById(id);
    if (!user) throw new UnauthorizedException('请提供教学 Bearer Token');
    request.user = { sub: user.id, username: user.username, role: user.role };
    return true;
  }
}
