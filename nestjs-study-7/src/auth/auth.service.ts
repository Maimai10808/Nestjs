import { Injectable } from '@nestjs/common';
import type { AuthUser } from './interfaces/auth-user.interface.js';

@Injectable()
export class AuthService {
  // 固定 Token 仅用于演示；Map 不会把 constructor 等原型属性当作用户。
  private readonly users = new Map<string, AuthUser>([
    [
      'admin-token',
      {
        id: 'user_001',
        name: 'Robin',
        email: 'robin@example.com',
        roles: ['admin', 'user'],
      },
    ],
    [
      'user-token',
      {
        id: 'user_002',
        name: 'Tom',
        email: 'tom@example.com',
        roles: ['user'],
      },
    ],
  ]);

  validateToken(token: string): AuthUser | null {
    return this.users.get(token) ?? null;
  }
}
