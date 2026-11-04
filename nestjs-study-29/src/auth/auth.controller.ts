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

  // 1. 用户登录
  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = this.authService.login(dto);

    // 登录成功后设置 Cookie
    response.cookie('session_id', result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: '登录成功',
      user: result.user,
    };
  }

  // 2. 查询当前登录用户
  @Get('me')
  getCurrentUser(
    @Req() request: Request,
  ) {
    const sessionId = request.cookies?.session_id;

    if (typeof sessionId !== 'string') {
      throw new UnauthorizedException('请先登录');
    }

    return this.authService.getCurrentUser(sessionId);
  }

  // 3. 退出登录
  @Post('logout')
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionId = request.cookies?.session_id;

    if (typeof sessionId === 'string') {
      this.authService.logout(sessionId);
    }

    // 删除浏览器中的 Cookie
    response.clearCookie('session_id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: '退出登录成功',
    };
  }
}
