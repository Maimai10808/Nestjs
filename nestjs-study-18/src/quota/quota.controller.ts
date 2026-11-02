import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

import { QuotaService } from './quota.service.js';

@Controller('quota')
export class QuotaController {
  constructor(
    private readonly quotaService: QuotaService,
  ) {}

  // 获取配额配置
  @Get('config')
  getConfig() {
    return this.quotaService.getConfig();
  }

  // 模拟配额检查
  @Get('check')
  checkQuota(
    @Query(
      'usedToday',
      new DefaultValuePipe(0),
      ParseIntPipe,
    )
    usedToday: number,
  ) {
    return this.quotaService.checkQuota(usedToday);
  }
}
