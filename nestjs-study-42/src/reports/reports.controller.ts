import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Render,
} from '@nestjs/common';

import { ReportsService } from './reports.service.js';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService:
      ReportsService,
  ) {}

  // 1. 报告列表
  @Get()
  @Render('reports')
  findAll() {
    return {
      title: 'AI 研究报告',

      reports:
        this.reportsService.findAll(),
    };
  }

  // 2. 报告 JSON
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.reportsService.findOne(
      id,
    );
  }

  // 3. HTML 报告预览
  @Get(':id/preview')
  @Render('report-preview')
  preview(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return {
      report:
        this.reportsService.findOne(
          id,
        ),
    };
  }
}
