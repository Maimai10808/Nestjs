import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { AgentsService } from './agents.service.js';
import { SessionGuard } from '../auth/session.guard.js';

interface CurrentUser {
  id: number;
  email: string;
  name: string;
}

type AuthenticatedRequest = Request & {
  user: CurrentUser;
};

@Controller('agents')
@UseGuards(SessionGuard)
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Get('my')
  findMyAgents(
    @Req() request: AuthenticatedRequest,
  ) {
    return this.agentsService.findMyAgents(
      request.user.id,
    );
  }
}
