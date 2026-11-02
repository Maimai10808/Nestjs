import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
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
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.findOne(id);
  }

  // POST /agents
  @Post()
  create(
    @Body()
    body: {
      name: string;
      description: string;
      model: string;
      userId: number;
    },
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
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      name?: string;
      description?: string;
      model?: string;
      enabled?: boolean;
    },
  ) {
    return this.agentsService.update(id, body);
  }

  // DELETE /agents/1
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.agentsService.remove(id);
  }
}
