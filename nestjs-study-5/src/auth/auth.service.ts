import { Injectable } from '@nestjs/common';
import type { AuthUser } from './auth.types.js';

@Injectable()
export class AuthService {
  // 仅用于本地学习的模拟 Token
  private readonly users = new Map<string, AuthUser>([
    [
      'demo-admin',
      {
        id: '1',
        username: 'admin',
        role: 'admin',
      },
    ],
    [
      'demo-developer',
      {
        id: '2',
        username: 'developer',
        role: 'developer',
      },
    ],
    [
      'demo-viewer',
      {
        id: '3',
        username: 'viewer',
        role: 'viewer',
      },
    ],
  ]);

  validateToken(token: string): AuthUser | null {
    return this.users.get(token) ?? null;
  }
}
