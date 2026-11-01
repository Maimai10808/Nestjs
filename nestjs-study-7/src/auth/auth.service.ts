import { Injectable } from '@nestjs/common';

import type { AuthUser } from './interfaces/auth-user.interface.js';

@Injectable()
export class AuthService {
  private readonly users: Record<string, AuthUser> = {
    'admin-token': {
      id: 'user_001',
      name: 'Robin',
      email: 'robin@example.com',
      roles: ['admin', 'user'],
    },

    'user-token': {
      id: 'user_002',
      name: 'Tom',
      email: 'tom@example.com',
      roles: ['user'],
    },
  };

  validateToken(token: string): AuthUser | null {
    return this.users[token] ?? null;
  }
}
