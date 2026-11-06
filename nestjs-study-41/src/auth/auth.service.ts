import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service.js';

import { PasswordService } from '../security/password.service.js';

import type { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly passwordService:
      PasswordService,

    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // 1. 根据用户名查询用户
    const user =
      this.usersService.findByUsername(
        dto.username,
      );

    if (!user) {
      throw new UnauthorizedException(
        '用户名或密码错误',
      );
    }

    // 2. 验证密码
    const isValid =
      await this.passwordService.verify(
        dto.password,
        user.passwordHash,
      );

    if (!isValid) {
      throw new UnauthorizedException(
        '用户名或密码错误',
      );
    }

    // 3. 创建 JWT Payload
    const payload = {
      sub: user.id,
      username: user.username,
    };

    // 4. 签发 JWT
    const accessToken =
      await this.jwtService.signAsync(
        payload,
      );

    // 5. 返回认证结果
    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
    };
  }

  getProfile(userId: number) {
    const user =
      this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException(
        '用户不存在',
      );
    }

    return user;
  }
}
