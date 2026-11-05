import { Body, Controller, Get, Post } from '@nestjs/common';
import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get('config')
  getConfiguration() { return this.agentsService.getConfiguration(); }

  @Post('generate')
  generate(@Body('prompt') prompt: unknown) { return this.agentsService.generate(prompt); }
}
