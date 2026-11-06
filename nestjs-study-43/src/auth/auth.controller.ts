import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import type {
  Request,
  Response,
} from 'express';

import { AuthService } from './auth.service.js';

import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // 登录
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
  ) {
    const user = this.authService.validateUser(
      dto.username,
      dto.password,
    );

    await new Promise<void>((resolve, reject) => {
      request.session.regenerate((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    request.session.userId = user.id;

    await new Promise<void>((resolve, reject) => {
      request.session.save((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    return {
      message: '登录成功',
      user,
    };
  }

  // 当前用户
  @Get('me')
  getCurrentUser(
    @Req() request: Request,
  ) {
    const userId = request.session.userId;

    if (!userId) {
      throw new UnauthorizedException(
        '请先登录',
      );
    }

    return this.authService.findById(userId);
  }

  // 退出
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await new Promise<void>((resolve, reject) => {
      request.session.destroy((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    response.clearCookie('agent.sid', {
      path: '/',
    });

    return {
      message: '退出登录成功',
    };
  }
}
