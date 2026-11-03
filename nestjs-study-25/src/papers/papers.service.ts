import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type {
  GeneratePaperV1Dto,
} from './dto/generate-paper-v1.dto.js';

import type {
  GeneratePaperV2Dto,
} from './dto/generate-paper-v2.dto.js';

type PaperTaskStatus = 'pending' | 'completed';

interface PaperTask {
  id: string;
  topic: string;
  status: PaperTaskStatus;
  result: string | null;
  createdAt: string;
}

@Injectable()
export class PapersService {
  private readonly tasks = new Map<string, PaperTask>();

  private nextTaskId = 1001;

  // V1：模拟同步论文生成
  generateV1(dto: GeneratePaperV1Dto) {
    return {
      title: dto.topic,
      content: `这是一篇关于《${dto.topic}》的 AI 生成论文。`,
    };
  }

  // V2：创建异步论文生成任务
  generateV2(dto: GeneratePaperV2Dto) {
    const taskId = `task-${this.nextTaskId++}`;

    const task: PaperTask = {
      id: taskId,
      topic: dto.topic,
      status: 'pending',
      result: null,
      createdAt: new Date().toISOString(),
    };

    this.tasks.set(taskId, task);

    // 模拟异步任务执行
    setTimeout(() => {
      task.status = 'completed';

      task.result =
        `论文《${dto.topic}》生成完成。` +
        `目标字数：${dto.config.wordCount}。` +
        `引用格式：${dto.config.citationStyle}。`;
    }, 3000);

    return {
      taskId,
      status: task.status,
      estimatedSeconds: 3,
    };
  }

  // 查询 V2 任务
  findTask(taskId: string): PaperTask {
    const task = this.tasks.get(taskId);

    if (!task) {
      throw new NotFoundException('论文生成任务不存在');
    }

    return task;
  }

  // V1 模型目录
  getModelsV1() {
    return [
      'gpt-4.1',
      'gpt-4.1-mini',
    ];
  }

  // V2 模型目录
  getModelsV2() {
    return [
      {
        id: 'gpt-4.1',
        provider: 'openai',
        supportsLongContext: true,
      },
      {
        id: 'claude-sonnet',
        provider: 'anthropic',
        supportsLongContext: true,
      },
    ];
  }

  // 论文模板
  getTemplates() {
    return [
      {
        id: 'research',
        name: '研究论文',
      },
      {
        id: 'review',
        name: '文献综述',
      },
    ];
  }
}
