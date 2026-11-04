import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

@Controller('external')
export class ExternalController {
  // 模拟外部模型目录 API
  @Get('models')
  getModels() {
    return [
      {
        id: 'gpt-4.1',
        provider: 'openai',
        contextWindow: 1000000,
      },
      {
        id: 'claude-sonnet',
        provider: 'anthropic',
        contextWindow: 200000,
      },
    ];
  }

  // 模拟外部搜索 API
  @Get('search')
  search(@Query('q') query: string) {
    return {
      query,
      results: [
        {
          title: `${query} - Official Documentation`,
          url: 'https://example.com/docs',
          snippet:
            'This documentation explains the architecture.',
        },
        {
          title: `${query} - Technical Article`,
          url: 'https://example.com/article',
          snippet:
            'This article discusses implementation details.',
        },
      ],
    };
  }

  // 模拟外部 AI 生成 API
  @Post('ai/generate')
  async generate(
    @Body() body: { prompt: string },
  ) {
    // 模拟 AI 模型执行耗时
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });

    return {
      model: 'gpt-4.1',
      output:
        `AI 已根据以下内容生成研究报告：\n\n${body.prompt}`,
      tokensUsed: 1200,
    };
  }
}
