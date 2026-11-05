import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { ReportsService } from './reports.service.js';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  // 生成报告
  @Post('generate')
  async generate() {
    const report =
      await this.reportsService.generateReport();

    return {
      id: report.id,
      title: report.title,
      filename: report.filename,
      size: report.size,
      createdAt: report.createdAt,
    };
  }

  // 查询报告列表
  @Get()
  findAll() {
    return this.reportsService.findAll().map(
      ({ path, ...report }) => report,
    );
  }

  @Get(':id/download')
  download(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.downloadReport(id);
  }

  // 查询报告详情
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { path, ...report } =
      this.reportsService.findOne(id);

    return report;
  }
}
