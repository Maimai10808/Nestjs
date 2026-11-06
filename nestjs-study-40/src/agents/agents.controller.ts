import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import {
  AgentsService,
} from './agents.service.js';

import {
  CreateAgentDto,
} from './dto/create-agent.dto.js';

import {
  UpdateAgentDto,
} from './dto/update-agent.dto.js';

import {
  PermissionsGuard,
} from '../authorization/permissions.guard.js';

import {
  Permission,
} from '../authorization/permission.enum.js';

import {
  RequirePermissions,
} from '../authorization/permissions.decorator.js';

import {
  PoliciesGuard,
} from '../authorization/policies.guard.js';

import {
  CheckPolicies,
} from '../authorization/check-policies.decorator.js';

import {
  Action,
} from '../authorization/action.enum.js';

import { Agent } from './agent.entity.js';

import { Role } from '../authorization/role.enum.js';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    username: string;
    role: Role;
  };
};

@Controller('agents')
@UseGuards(
  PermissionsGuard,
  PoliciesGuard,
)
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 1. 查询可访问的 Agent
  @Get()
  @RequirePermissions(
    Permission.AGENT_READ,
  )
  findAll(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.agentsService.findAll({
      id: request.user.sub,
      role: request.user.role,
    });
  }

  // 2. 查询自己的 Agent
  @Get('my')
  @RequirePermissions(
    Permission.AGENT_READ,
  )
  findMyAgents(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.agentsService.findMyAgents(
      request.user.sub,
    );
  }

  // 3. 创建 Agent
  @Post()
  @RequirePermissions(
    Permission.AGENT_CREATE,
  )
  @CheckPolicies(
    (ability) =>
      ability.can(Action.Create, Agent),
  )
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateAgentDto,
  ) {
    return this.agentsService.create(
      {
        id: request.user.sub,
        role: request.user.role,
      },
      dto,
    );
  }

  // 4. 更新 Agent
  @Patch(':id')
  @RequirePermissions(
    Permission.AGENT_UPDATE,
  )
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agentsService.update(
      {
        id: request.user.sub,
        role: request.user.role,
      },
      id,
      dto,
    );
  }

  // 5. 删除 Agent
  @Delete(':id')
  @RequirePermissions(
    Permission.AGENT_DELETE,
  )
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.remove(
      {
        id: request.user.sub,
        role: request.user.role,
      },
      id,
    );
  }

  // 6. 执行 Agent
  @Post(':id/run')
  @RequirePermissions(
    Permission.AGENT_EXECUTE,
  )
  run(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.run(
      {
        id: request.user.sub,
        role: request.user.role,
      },
      id,
    );
  }
}
