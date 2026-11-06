import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  IsInt,
  Min,
} from 'class-validator';

import { AgentsService } from './agents.service.js';

import { AuthGuard } from '../auth/auth.guard.js';

import type {
  AuthenticatedRequest,
} from '../auth/auth.guard.js';

class RunAgentDto {
  @IsInt()
  @Min(1)
  providerId!: number;
}

@Controller('agents')
@UseGuards(AuthGuard)
export class AgentsController {
  constructor(
    private readonly agentsService:
      AgentsService,
  ) {}

  @Post('run')
  run(
    @Req() request: AuthenticatedRequest,

    @Body() dto: RunAgentDto,
  ) {
    return this.agentsService.run(
      request.user.sub,
      dto.providerId,
    );
  }
}
