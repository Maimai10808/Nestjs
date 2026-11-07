import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { setTimeout as delay } from 'node:timers/promises';

import type {
  ResearchProgress,
  ResearchStage,
} from './agent.interface.js';

@Injectable()
export class AgentsService implements OnModuleDestroy {
  private readonly shutdown = new AbortController();

  onModuleDestroy(): void {
    this.shutdown.abort();
  }
  private readonly stages: Array<{
    stage: ResearchStage;
    progress: number;
    message: string;
  }> = [
    {
      stage: 'planning',
      progress: 20,
      message: '正在制定研究计划',
    },
    {
      stage: 'searching',
      progress: 40,
      message: '正在检索研究资料',
    },
    {
      stage: 'analyzing',
      progress: 60,
      message: '正在分析研究结果',
    },
    {
      stage: 'generating',
      progress: 80,
      message: '正在生成研究报告',
    },
    {
      stage: 'completed',
      progress: 100,
      message: '研究报告生成完成',
    },
  ];

  async execute(
    taskId: string,
    onProgress: (
      progress: ResearchProgress,
    ) => void,
  ): Promise<void> {
    try {
      for (const item of this.stages) {
        await delay(1000, undefined, { signal: this.shutdown.signal });
        if (this.shutdown.signal.aborted) return;

        onProgress({
          taskId,
          stage: item.stage,
          progress: item.progress,
          message: item.message,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      if (!this.shutdown.signal.aborted) throw error;
    }
  }
}
