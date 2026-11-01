import {
  Body,
  Controller,
  Post,
  BadRequestException,
} from '@nestjs/common';

import {
  AgentsService,
  type AgentType,
} from './agents.service.js';

interface RunAgentDto {
  type: AgentType;
  prompt: string;
}

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  @Post('run')
  async run(@Body() body: RunAgentDto) {
    if (
      !['chat', 'research', 'coding'].includes(body?.type) ||
      typeof body?.prompt !== 'string' ||
      !body.prompt.trim()
    ) {
      throw new BadRequestException('Invalid agent request');
    }

    return this.agentsService.run(
      body.type,
      body.prompt,
    );
  }
}
