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

import { AgentsService } from './agents.service.js';

import { SessionGuard } from '../auth/session.guard.js';

import { CreateAgentDto } from './dto/create-agent.dto.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  @Get('my')
  @UseGuards(SessionGuard)
  findMyAgents(
    @Req() request: Request,
  ) {
    return this.agentsService.findMyAgents(
      request.session.userId!,
    );
  }

  @Post()
  @UseGuards(SessionGuard)
  create(
    @Req() request: Request,
    @Body() dto: CreateAgentDto,
  ) {
    return this.agentsService.create(
      request.session.userId!,
      dto.name,
      dto.model,
    );
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return this.agentsService.update(
      request.session.userId!,
      id,
      name,
    );
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.remove(
      request.session.userId!,
      id,
    );
  }
}
