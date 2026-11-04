import {
  Controller,
  Get,
} from '@nestjs/common';

import { ReportsService } from './reports.service.js';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get('small')
  getSmallReport() {
    return this.reportsService.getSmallReport();
  }

  @Get('large')
  getLargeReport() {
    return this.reportsService.getLargeReport();
  }

  @Get('huge')
  getHugeReport() {
    return this.reportsService.getHugeReport();
  }

  @Get('stats')
  getStats() {
    return this.reportsService.getStats();
  }
}
