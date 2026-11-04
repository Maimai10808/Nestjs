import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { AgentsService } from './agents.service.js';
import { SessionGuard } from '../auth/session.guard.js';

@Controller('agents')
@UseGuards(SessionGuard)
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Get('my')
  findMyAgents(
    @Req() request: Request,
  ) {
    return this.agentsService.findMyAgents(
      request.session.userId!,
    );
  }
}
