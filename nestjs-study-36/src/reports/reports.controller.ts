import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Render,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { ReportsService } from './reports.service.js';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  // 1. 报告列表
  @Get()
  @Render('reports')
  findAll() {
    return {
      title: 'AI 研究报告',
      reports: this.reportsService.findAll(),
    };
  }

  // 2. 报告详情
  @Get(':id')
  @Render('report')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      report: this.reportsService.findOne(id),
    };
  }

  // 3. 打印页面
  @Get(':id/print')
  @Render('report-print')
  print(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      report: this.reportsService.findOne(id),
      layout: false,
    };
  }

  // 4. 原始 JSON
  @Get(':id/raw')
  raw(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reportsService.findOne(id);
  }

  // 5. 动态模板渲染
  @Get(':id/preview')
  preview(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ) {
    const report = this.reportsService.findOne(id);

    const viewName =
      report.status === 'completed'
        ? 'report'
        : 'report-generating';

    return response.render(viewName, {
      report,
    });
  }
}
