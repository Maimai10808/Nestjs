import {
  Injectable,
  ServiceUnavailableException,
  OnApplicationBootstrap,
  OnModuleDestroy,
  BeforeApplicationShutdown,
  OnApplicationShutdown,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { DatabaseService } from '../infrastructure/database.service.js';

export interface AgentTask {
  id: string;
  status: 'running' | 'completed';
}

@Injectable()
export class AgentsService
  implements
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  private acceptingTasks = true;

  private readonly tasks = new Map<string, AgentTask>();

  private readonly runningTasks = new Set<Promise<void>>();

  constructor(
    private readonly databaseService: DatabaseService,
  ) {
    console.log('[Agents] constructor 执行');
  }

  // ==========================================
  // 1. 所有模块初始化完成后
  // ==========================================

  onApplicationBootstrap() {
    console.log('[Agents] 应用初始化完成');

    if (!this.databaseService.isConnected()) {
      throw new Error('数据库尚未准备完成');
    }

    console.log('[Agents] Agent 系统准备就绪');
  }

  // ==========================================
  // 2. 创建 Agent 任务
  // ==========================================

  createTask() {
    if (!this.acceptingTasks) {
      throw new ServiceUnavailableException(
        '系统正在关闭，暂不接受新任务',
      );
    }

    const taskId = randomUUID();

    const task: AgentTask = {
      id: taskId,
      status: 'running',
    };

    this.tasks.set(taskId, task);

    const promise = this.executeTask(taskId);

    this.runningTasks.add(promise);

    void promise.finally(() => {
      this.runningTasks.delete(promise);
    });

    return task;
  }

  // ==========================================
  // 3. 模拟执行 AI Agent
  // ==========================================

  private async executeTask(taskId: string): Promise<void> {
    console.log(`[Agents] 开始执行任务 ${taskId}`);

    // 模拟 LLM 推理或工具调用
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const task = this.tasks.get(taskId);

    if (task) {
      task.status = 'completed';
    }

    console.log(`[Agents] 任务完成 ${taskId}`);
  }

  // ==========================================
  // 4. 查询任务
  // ==========================================

  findTask(taskId: string) {
    return this.tasks.get(taskId) ?? null;
  }

  // ==========================================
  // 5. 应用开始关闭
  // ==========================================

  onModuleDestroy() {
    console.log('[Agents] 收到关闭通知');

    // 不再接受新的任务
    this.acceptingTasks = false;
  }

  // ==========================================
  // 6. 等待正在执行的任务
  // ==========================================

  async beforeApplicationShutdown() {
    console.log('[Agents] 等待正在执行的任务完成');

    await Promise.allSettled([...this.runningTasks]);

    console.log('[Agents] 所有已跟踪任务处理完毕');
  }

  // ==========================================
  // 7. 应用关闭完成
  // ==========================================

  onApplicationShutdown(signal?: string) {
    console.log('[Agents] 应用关闭完成');

    console.log('[Agents] 关闭信号:', signal ?? '手动关闭');
  }
}
