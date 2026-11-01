import { Injectable } from '@nestjs/common';

@Injectable()
export class ResearchService {
  constructor() {
    console.log('[ResearchService] 初始化');
  }

  async run(prompt: string) {
    console.log('[ResearchService] 开始执行研究任务');

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    return {
      type: 'research',
      result: `深度研究完成：${prompt}`,
    };
  }
}
