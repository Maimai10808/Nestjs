import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import type {
  ResearchTask,
} from './research.interface.js';

import type {
  CreateResearchDto,
} from './dto/create-research.dto.js';

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(
    ResearchService.name,
  );

  private readonly tasks =
    new Map<string, ResearchTask>();

  create(dto: CreateResearchDto): ResearchTask {
    const now = new Date().toISOString();

    const task: ResearchTask = {
      id: randomUUID(),

      topic: dto.topic,

      model: dto.model,

      status: 'pending',

      progress: 0,

      result: null,

      createdAt: now,

      updatedAt: now,
    };

    this.tasks.set(task.id, task);

    void this.execute(task.id);

    return task;
  }

  findAll(): ResearchTask[] {
    return Array.from(
      this.tasks.values(),
    );
  }

  findOne(id: string): ResearchTask {
    const task = this.tasks.get(id);

    if (!task) {
      throw new NotFoundException(
        '研究任务不存在',
      );
    }

    return task;
  }

  private async execute(
    taskId: string,
  ): Promise<void> {
    const task = this.findOne(taskId);

    try {
      task.status = 'running';

      this.logger.log(
        `开始执行研究任务：${taskId}`,
      );

      for (const progress of [
        20,
        40,
        60,
        80,
      ]) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 1000);
        });

        task.progress = progress;
        task.updatedAt =
          new Date().toISOString();
      }

      task.status = 'completed';

      task.progress = 100;

      task.result =
        `已模拟完成《${task.topic}》的研究报告`;

      task.updatedAt =
        new Date().toISOString();

      this.logger.log(
        `研究任务完成：${taskId}`,
      );
    } catch (error) {
      task.status = 'failed';

      task.updatedAt =
        new Date().toISOString();

      this.logger.error(
        `研究任务失败：${taskId}`,
        error instanceof Error
          ? error.stack
          : String(error),
      );
    }
  }
}
