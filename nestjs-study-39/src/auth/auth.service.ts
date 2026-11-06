import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service.js';

import type {
  LoginDto,
} from './dto/login.dto.js';

import type {
  JwtPayload,
} from './jwt-payload.interface.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: LoginDto) {
    // 1. 查询用户
    const user = this.usersService.findByUsername(
      dto.username,
    );

    if (!user) {
      throw new UnauthorizedException(
        '用户名或密码错误',
      );
    }

    // 2. 验证密码
    const isPasswordValid =
      await this.usersService.verifyPassword(
        dto.password,
        user.passwordHash,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '用户名或密码错误',
      );
    }

    // 3. 创建 JWT Payload
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // 4. 签发 JWT
    const accessToken =
      await this.jwtService.signAsync(payload);

    // 5. 返回 Token
    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 60,
    };
  }

  getProfile(userId: number) {
    const user = this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException(
        '用户不存在',
      );
    }

    return user;
  }
}
