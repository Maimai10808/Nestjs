import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProvidersService } from './providers.service.js';

import { CreateProviderDto } from './dto/create-provider.dto.js';

import { AuthGuard } from '../auth/auth.guard.js';

import type {
  AuthenticatedRequest,
} from '../auth/auth.guard.js';

@Controller('providers')
@UseGuards(AuthGuard)
export class ProvidersController {
  constructor(
    private readonly providersService:
      ProvidersService,
  ) {}

  // 1. 保存 AI API Key
  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateProviderDto,
  ) {
    return this.providersService.create(
      request.user.sub,
      dto,
    );
  }

  // 2. 查询自己的 Provider
  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.providersService.findAll(
      request.user.sub,
    );
  }

  // 3. 查询 Provider 元数据
  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,

    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.providersService.findOne(
      request.user.sub,
      id,
    );
  }

  // 4. 删除 Provider
  @Delete(':id')
  remove(
    @Req() request: AuthenticatedRequest,

    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.providersService.remove(
      request.user.sub,
      id,
    );
  }
}
