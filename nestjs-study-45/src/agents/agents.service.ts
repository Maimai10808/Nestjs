import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import type {
  AgentTask,
  AgentStatus,
} from './agent.interface.js';

@Injectable()
export class AgentsService {
  private readonly tasks =
    new Map<string, AgentTask>();

  // 创建任务
  createTask(
    clientId: string,
    prompt: string,
  ): AgentTask {
    const now = new Date().toISOString();

    const task: AgentTask = {
      id: randomUUID(),
      clientId,
      prompt,
      status: 'idle',
      progress: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);

    return task;
  }

  // 查询任务
  findOne(taskId: string): AgentTask {
    const task = this.tasks.get(taskId);

    if (!task) {
      throw new NotFoundException(
        'Agent 任务不存在',
      );
    }

    return task;
  }

  // 更新任务状态
  updateStatus(
    taskId: string,
    status: AgentStatus,
    progress: number,
  ): AgentTask {
    const task = this.findOne(taskId);

    task.status = status;
    task.progress = progress;
    task.updatedAt =
      new Date().toISOString();

    return task;
  }

  // 取消任务
  cancelTask(taskId: string): AgentTask {
    const task = this.findOne(taskId);

    if (
      task.status === 'completed' ||
      task.status === 'cancelled'
    ) {
      return task;
    }

    return this.updateStatus(
      taskId,
      'cancelled',
      task.progress,
    );
  }

  // 查询客户端的任务
  findByClient(
    clientId: string,
  ): AgentTask[] {
    return Array.from(
      this.tasks.values(),
    ).filter(
      (task) => task.clientId === clientId,
    );
  }
}
