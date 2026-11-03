import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { PapersService } from './papers.service.js';

import { GeneratePaperV1Dto } from './dto/generate-paper-v1.dto.js';

@Controller({
  path: 'papers',
  version: '1',
})
export class PapersV1Controller {
  constructor(
    private readonly papersService: PapersService,
  ) {}

  @Post('generate')
  generate(
    @Body() dto: GeneratePaperV1Dto,
  ) {
    return this.papersService.generateV1(dto);
  }
}
