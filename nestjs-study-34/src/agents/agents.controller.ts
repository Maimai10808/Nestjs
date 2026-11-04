import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

import { ResearchDto } from './dto/research.dto.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Post('research')
  research(
    @Body() dto: ResearchDto,
  ) {
    return this.agentsService.research(dto);
  }
}
