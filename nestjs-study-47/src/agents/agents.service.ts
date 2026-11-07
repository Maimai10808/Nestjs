import { Injectable } from '@nestjs/common';

import type {
  ResearchProgress,
  ResearchStage,
} from './agent.interface.js';

@Injectable()
export class AgentsService {
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
    for (const item of this.stages) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });

      onProgress({
        taskId,
        stage: item.stage,
        progress: item.progress,
        message: item.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
