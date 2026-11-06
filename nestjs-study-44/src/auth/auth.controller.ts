import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  Throttle,
} from '@nestjs/throttler';

import { AuthService } from './auth.service.js';

import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    short: {
      ttl: 1000,
      limit: 2,
    },
    medium: {
      ttl: 10000,
      limit: 3,
    },
    long: {
      ttl: 60000,
      limit: 5,
    },
  })
  login(
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(
      dto.username,
      dto.password,
    );
  }
}
