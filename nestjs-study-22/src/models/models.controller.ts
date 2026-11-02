import {
  Controller,
  Get,
} from '@nestjs/common';

import { ModelsService } from './models.service.js';

@Controller('models')
export class ModelsController {
  constructor(
    private readonly modelsService: ModelsService,
  ) {}

  @Get()
  findAll() {
    return this.modelsService.findAll();
  }
}
