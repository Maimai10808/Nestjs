import {
  Controller,
  Get,
  Req,
  Res,
} from '@nestjs/common';

import type {
  Request,
  Response,
} from 'express';

import {
  createCsrfProtection,
} from './csrf.config.js';

@Controller('security')
export class SecurityController {
  private readonly csrf = createCsrfProtection(
    process.env.CSRF_SECRET ?? '',
  );

  // 获取 CSRF Token
  @Get('csrf-token')
  getCsrfToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // 初始化匿名 Session
    request.session.csrfInitialized = true;

    const csrfToken =
      this.csrf.generateCsrfToken(
        request,
        response,
      );

    return {
      csrfToken,
    };
  }

  // 查看 CORS 配置
  @Get('cors-info')
  getCorsInfo() {
    return {
      frontendOrigin:
        process.env.FRONTEND_ORIGIN ??
        'http://localhost:8888',

      credentials: true,

      csrfHeader: 'X-CSRF-Token',
    };
  }
}
