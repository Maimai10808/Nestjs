import { Injectable } from '@nestjs/common';

export interface CurrentUser {
  id: number;
  username: string;
  role: 'user' | 'admin';
}

@Injectable()
export class AuthService {
  private readonly tokens = new Map<
    string,
    CurrentUser
  >([
    [
      'demo-robin-token',
      {
        id: 1001,
        username: 'robin',
        role: 'user',
      },
    ],
    [
      'demo-alan-token',
      {
        id: 1002,
        username: 'alan',
        role: 'user',
      },
    ],
    [
      'demo-admin-token',
      {
        id: 1003,
        username: 'admin',
        role: 'admin',
      },
    ],
  ]);

  validateToken(
    token: unknown,
  ): CurrentUser | null {
    if (typeof token !== 'string') {
      return null;
    }

    return this.tokens.get(token) ?? null;
  }
}
