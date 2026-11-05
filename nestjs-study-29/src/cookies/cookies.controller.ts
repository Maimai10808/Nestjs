import { Body, Controller, Get, Post, Res } from '@nestjs/common';

import type { Response } from 'express';

import { Cookies } from './cookies.decorator.js';
import { PreferencesDto } from './dto/preferences.dto.js';

@Controller('cookies')
export class CookiesController {
  // 1. 查看 Cookie 信息
  @Get('debug')
  debug(@Cookies() cookies: Record<string, string>) {
    return {
      cookieNames: Object.keys(cookies ?? {}),
      message: 'Cookie 解析成功',
    };
  }

  // 2. 读取用户偏好
  @Get('preferences')
  getPreferences(
    @Cookies('theme') theme: string | undefined,
    @Cookies('language') language: string | undefined,
  ) {
    return {
      theme: theme === 'dark' ? 'dark' : 'light',
      language: ['zh-CN', 'en-US'].includes(language ?? '')
        ? language
        : 'zh-CN',
    };
  }

  // 3. 保存用户偏好
  @Post('preferences')
  savePreferences(
    @Body() body: PreferencesDto,

    @Res({ passthrough: true })
    response: Response,
  ) {
    response.cookie('theme', body.theme, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    response.cookie('language', body.language, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: '用户偏好保存成功',
      preferences: body,
    };
  }
}
