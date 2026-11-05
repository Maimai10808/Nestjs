import { ParseDatabaseIdPipe } from '../common/pipes/parse-database-id.pipe.js';
import { CreateAgentDto } from './dto/create-agent.dto.js';
import { UpdateAgentDto } from './dto/update-agent.dto.js';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // GET /agents
  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  // GET /agents/1
  @Get(':id')
  findOne(
    @Param('id', ParseDatabaseIdPipe) id: number,
  ) {
    return this.agentsService.findOne(id);
  }

  // POST /agents
  @Post()
  create(
    @Body()
    body: CreateAgentDto,
  ) {
    return this.agentsService.create(
      body.name,
      body.description,
      body.model,
      body.userId,
    );
  }

  // PATCH /agents/1
  @Patch(':id')
  update(
    @Param('id', ParseDatabaseIdPipe) id: number,
    @Body()
    body: UpdateAgentDto,
  ) {
    return this.agentsService.update(id, body);
  }

  // DELETE /agents/1
  @Delete(':id')
  remove(
    @Param('id', ParseDatabaseIdPipe) id: number,
  ) {
    return this.agentsService.remove(id);
  }
}
