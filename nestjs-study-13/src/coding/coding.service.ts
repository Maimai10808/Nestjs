import { Injectable } from '@nestjs/common';

@Injectable()
export class CodingService {
  constructor() {
    console.log('[CodingService] 初始化');
  }

  async run(prompt: string) {
    console.log('[CodingService] 开始执行代码任务');

    await new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });

    return {
      type: 'coding',
      result: `代码任务完成：${prompt}`,
    };
  }
}
