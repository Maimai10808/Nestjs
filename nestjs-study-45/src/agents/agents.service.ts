import {
  Injectable,
  NotFoundException,
  BadRequestException,
  type OnModuleDestroy,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import type {
  AgentTask,
  AgentStatus,
} from './agent.interface.js';

@Injectable()
export class AgentsService implements OnModuleDestroy {
  private readonly executions = new Map<string, AbortController>();
  private readonly approvals = new Map<string, {
    resolve: () => void;
    reject: (error: Error) => void;
  }>();

  registerExecution(taskId: string): AbortSignal {
    this.findOne(taskId);
    if (this.executions.has(taskId)) {
      throw new BadRequestException('任务已经在执行');
    }
    const controller = new AbortController();
    this.executions.set(taskId, controller);
    return controller.signal;
  }

  waitForApproval(taskId: string): Promise<void> {
    const controller = this.executions.get(taskId);
    if (!controller || controller.signal.aborted) {
      return Promise.reject(new Error('任务已取消'));
    }
    if (this.findOne(taskId).status !== 'waiting_approval' || this.approvals.has(taskId)) {
      return Promise.reject(new Error('任务当前不接受审批'));
    }
    return new Promise<void>((resolve, reject) => {
      this.approvals.set(taskId, { resolve, reject });
    });
  }

  approveTask(taskId: string): void {
    const approval = this.approvals.get(taskId);
    if (!approval || this.findOne(taskId).status !== 'waiting_approval') {
      throw new BadRequestException('任务当前不接受审批');
    }
    this.approvals.delete(taskId);
    approval.resolve();
  }

  abortTask(taskId: string): void {
    this.executions.get(taskId)?.abort();
    const approval = this.approvals.get(taskId);
    this.approvals.delete(taskId);
    approval?.reject(new Error('任务已取消'));
  }

  finishExecution(taskId: string): void {
    this.abortTask(taskId);
    this.executions.delete(taskId);
  }

  onModuleDestroy(): void {
    for (const taskId of this.executions.keys()) {
      this.abortTask(taskId);
      this.cancelTask(taskId);
    }
    this.executions.clear();
  }

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
