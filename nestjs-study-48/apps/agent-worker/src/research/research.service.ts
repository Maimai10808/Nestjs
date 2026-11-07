import { Injectable, Logger } from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import type {
  ResearchRequest,
  ResearchResult,
  ResearchSubmittedEvent,
} from '../../../../libs/contracts/src/index.js';

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(
    ResearchService.name,
  );

  async analyze(
    request: ResearchRequest,
  ): Promise<ResearchResult> {
    const startTime = performance.now();

    this.logger.log(
      `开始研究：${request.topic}`,
    );

    // 模拟 AI Agent 执行
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1500);
    });

    return {
      taskId: randomUUID(),

      topic: request.topic,

      model: request.model,

      summary:
        `已模拟完成《${request.topic}》的研究分析`,

      durationMs: Math.round(
        performance.now() - startTime,
      ),

      completedAt:
        new Date().toISOString(),
    };
  }

  getModels() {
    return [
      {
        id: 'gpt-4.1',
        provider: 'openai',
      },
      {
        id: 'claude-sonnet',
        provider: 'anthropic',
      },
    ];
  }

  async slowTask() {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 10000);
    });

    return {
      message: '慢任务执行完成',
    };
  }

  handleSubmitted(
    event: ResearchSubmittedEvent,
  ) {
    this.logger.log(
      `收到研究任务事件：${event.taskId}`,
    );

    this.logger.log(
      `研究主题：${event.topic}`,
    );
  }
}
