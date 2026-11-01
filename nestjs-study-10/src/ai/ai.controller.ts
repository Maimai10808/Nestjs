import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { AiService } from './ai.service.js';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
  ) {}

  // 查看当前模块配置
  @Get('config')
  getConfig() {
    return this.aiService.getConfig();
  }

  // 模拟 AI 生成
  @Post('generate')
  generate(@Body('prompt') prompt: unknown) {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new BadRequestException('prompt 必须是非空字符串');
    }

    return this.aiService.generate(prompt);
  }
}
