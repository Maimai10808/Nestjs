import {
  Controller,
  Get,
  Render,
} from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  @Render('index')
  home() {
    return {
      title: 'AI Deep Research Platform',

      description:
        '使用 NestJS + Helmet 构建安全的 AI 研究报告平台',
    };
  }
}
