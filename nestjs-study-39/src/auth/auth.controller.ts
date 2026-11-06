import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';

import type { Request } from 'express';

import { AuthService } from './auth.service.js';

import { LoginDto } from './dto/login.dto.js';

import { Public } from './public.decorator.js';

import type {
  AuthenticatedUser,
} from './jwt-payload.interface.js';

type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // 1. 用户登录
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body() dto: LoginDto,
  ) {
    return this.authService.signIn(dto);
  }

  // 2. 查询当前用户
  @Get('profile')
  getProfile(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.authService.getProfile(
      request.user.sub,
    );
  }
}
