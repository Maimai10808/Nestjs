import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { ResearchService } from './research.service.js';

import { ResearchDto } from './dto/research.dto.js';

@Controller('research')
export class ResearchController {
  constructor(
    private readonly researchService:
      ResearchService,
  ) {}

  @Post('analyze')
  analyze(
    @Body() dto: ResearchDto,
  ) {
    return this.researchService.analyze(
      dto,
    );
  }

  @Post('submit')
  submit(
    @Body() dto: ResearchDto,
  ) {
    return this.researchService.submit(
      dto.topic,
    );
  }

  @Get('models')
  getModels() {
    return this.researchService.getModels();
  }

  @Get('slow')
  slow() {
    return this.researchService.slow();
  }
}
