import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import {
  RolesGuard,
} from '../authorization/roles.guard.js';

import {
  Roles,
} from '../authorization/roles.decorator.js';

import {
  Role,
} from '../authorization/role.enum.js';

import {
  UsersService,
} from '../users/users.service.js';

import {
  AgentsService,
} from '../agents/agents.service.js';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,

    private readonly agentsService: AgentsService,
  ) {}

  // 1. 查询用户
  @Get('users')
  findUsers() {
    return this.usersService.findAll();
  }

  // 2. 平台统计
  @Get('stats')
  getStats() {
    return {
      totalUsers:
        this.usersService.findAll().length,

      totalAgents:
        this.agentsService.findAll({
          id: 1003,
          role: Role.ADMIN,
        }).length,
    };
  }
}
