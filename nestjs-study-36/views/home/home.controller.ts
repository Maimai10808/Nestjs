import {
  Controller,
  Get,
  Render,
} from '@nestjs/common';

import { ReportsService } from '../reports/reports.service.js';

@Controller()
export class HomeController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  @Render('index')
  home() {
    return {
      title: 'AI Deep Research Platform',
      description:
        '通过 AI Agent 自动生成技术研究报告',
      reportCount: this.reportsService.count(),
    };
  }
}
