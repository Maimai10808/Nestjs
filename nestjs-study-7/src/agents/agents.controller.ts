import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Auth } from '../common/decorators/auth.decorator.js';

import { AuthGuard } from '../common/guards/auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

import { CreateAgentDto } from './dto/create-agent.dto.js';
import { UpdateAgentDto } from './dto/update-agent.dto.js';

import type { AuthUser } from '../common/interfaces/auth-user.interface.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // ==========================================
  // 1. 公开接口：@Public()
  // ==========================================

  @Public()
  @Get('public')
  findPublicAgents() {
    return this.agentsService.findPublic();
  }

  // ==========================================
  // 2. 获取当前登录用户：@CurrentUser()
  // ==========================================

  @Get('me')
  @UseGuards(AuthGuard)
  getCurrentUser(
    @CurrentUser() user: AuthUser,
  ) {
    return {
      message: '当前登录用户',
      user,
    };
  }

  // ==========================================
  // 3. 获取用户指定字段
  // ==========================================

  @Get('my-id')
  @UseGuards(AuthGuard)
  getMyId(
    @CurrentUser('id') userId: number,
  ) {
    return {
      userId,
    };
  }

  // ==========================================
  // 4. 获取当前用户的 Agent
  // ==========================================

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @CurrentUser('id') userId: number,
  ) {
    return this.agentsService.findByUserId(userId);
  }

  // ==========================================
  // 5. 创建 Agent：DTO + ValidationPipe
  // ==========================================

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))
  create(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateAgentDto,
  ) {
    return this.agentsService.create(userId, dto);
  }

  // ==========================================
  // 6. 管理员接口：@Roles()
  // ==========================================

  @Get('admin/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  findAllForAdmin() {
    return this.agentsService.findAll();
  }

  // ==========================================
  // 7. 组合装饰器：@Auth()
  // ==========================================

  @Delete('admin/:id')
  @Auth('admin')
  removeForAdmin(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.remove(id);
  }

  // ==========================================
  // 8. 修改 Agent
  // ==========================================

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agentsService.updateForUser(
      id,
      userId,
      dto,
    );
  }

  // ==========================================
  // 9. 获取指定 Agent
  // ==========================================

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.agentsService.findOneForUser(
      id,
      userId,
    );
  }
}
