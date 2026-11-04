import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SessionService } from './session.service.js';

import type { LoginDto } from './dto/login.dto.js';

interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
  ) {}

  // 教学账号，不用于生产环境
  private readonly users = [
    {
      id: 1001,
      email: 'robin@example.com',
      name: 'Robin',
      password: '123456',
    },
    {
      id: 1002,
      email: 'alan@example.com',
      name: 'Alan',
      password: '123456',
    },
  ];

  login(dto: LoginDto) {
    const user = this.users.find(
      (item) =>
        item.email === dto.email &&
        item.password === dto.password,
    );

    if (!user) {
      throw new UnauthorizedException(
        '邮箱或密码错误',
      );
    }

    const sessionId =
      this.sessionService.createSession(user.id);

    return {
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  getCurrentUser(sessionId: string): User {
    const session =
      this.sessionService.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException(
        '登录状态已失效',
      );
    }

    const user = this.users.find(
      (item) => item.id === session.userId,
    );

    if (!user) {
      throw new UnauthorizedException(
        '用户不存在',
      );
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  logout(sessionId: string): void {
    this.sessionService.deleteSession(sessionId);
  }
}
