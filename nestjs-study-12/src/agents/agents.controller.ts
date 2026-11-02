import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Post('generate')
  generate(
    @Body('model') model: unknown,
    @Body('prompt') prompt: unknown,
  ) {
    return this.agentsService.generate(model, prompt);
  }
}
