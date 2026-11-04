import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { LoginDto } from './dto/login.dto.js';

export interface User {
  id: number;
  email: string;
  name: string;
}

interface StoredUser extends User {
  password: string;
}

@Injectable()
export class AuthService {
  // 本地学习账号
  private readonly users: StoredUser[] = [
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

  // 验证用户登录
  validateUser(dto: LoginDto): User {
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

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  // 根据用户 ID 查询用户
  findUserById(userId: number): User {
    const user = this.users.find(
      (item) => item.id === userId,
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
}
