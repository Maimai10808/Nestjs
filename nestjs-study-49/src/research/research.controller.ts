import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { ResearchService } from './research.service.js';

import { CreateResearchDto } from './dto/create-research.dto.js';

@Controller('research')
export class ResearchController {
  constructor(
    private readonly researchService:
      ResearchService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateResearchDto,
  ) {
    return this.researchService.create(dto);
  }

  @Get()
  findAll() {
    return this.researchService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.researchService.findOne(id);
  }
}
