import {
  Controller,
  Get,
} from '@nestjs/common';

import { AnalyticsService } from './analytics.service.js';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get()
  findAll() {
    return this.analyticsService.findAll();
  }
}
