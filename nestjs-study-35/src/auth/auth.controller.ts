import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SessionGuard } from './session.guard.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // 1. 用户登录
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
  ) {
    const user = this.authService.validateUser(dto);

    // 登录成功后重新生成 Session ID
    await new Promise<void>((resolve, reject) => {
      request.session.regenerate((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    // 保存登录状态
    request.session.userId = user.id;
    request.session.loginAt =
      new Date().toISOString();

    // 明确等待 Session 保存完成
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

  // 2. 查询当前用户
  @Get('me')
  @UseGuards(SessionGuard)
  getCurrentUser(
    @Req() request: Request,
  ) {
    const userId = request.session.userId;

    if (userId === undefined) {
      throw new UnauthorizedException('请先登录');
    }

    return this.authService.findUserById(userId);
  }

  // 3. 退出登录
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
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      message: '退出登录成功',
    };
  }
}
