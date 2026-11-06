import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';

import { AuthGuard } from './auth.guard.js';

import type {
  AuthenticatedRequest,
} from './auth.guard.js';

import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService:
      AuthService,
  ) {}

  // 用户登录
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(dto);
  }

  // 查询当前用户
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.authService.getProfile(
      request.user.sub,
    );
  }
}
