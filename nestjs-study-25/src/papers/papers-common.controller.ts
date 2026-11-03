import {
  Controller,
  Get,
  Version,
} from '@nestjs/common';

import { PapersService } from './papers.service.js';

@Controller('papers')
export class PapersCommonController {
  constructor(
    private readonly papersService: PapersService,
  ) {}

  // V1：返回字符串形式的模型目录
  @Version('1')
  @Get('models')
  getModelsV1() {
    return this.papersService.getModelsV1();
  }

  // V2：返回结构化模型目录
  @Version('2')
  @Get('models')
  getModelsV2() {
    return this.papersService.getModelsV2();
  }

  // V1 和 V2 共用论文模板接口
  @Version(['1', '2'])
  @Get('templates')
  getTemplates() {
    return this.papersService.getTemplates();
  }
}
