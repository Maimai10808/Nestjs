import {
  Injectable,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

interface AgentTask {
  id: string;
  userId: number;
  prompt: string;
  model: string;
  status: 'completed';
  result: string;
  durationMs: number;
}

@Injectable()
export class AgentsService {
  private readonly tasks: AgentTask[] = [];

  async execute(
    userId: number,
    prompt: string,
    model: string,
  ): Promise<AgentTask> {
    const startedAt = performance.now();

    // 模拟 AI Agent 执行
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1500);
    });

    const task: AgentTask = {
      id: randomUUID(),
      userId,
      prompt,
      model,
      status: 'completed',

      result:
        `已模拟完成 Coding Agent 任务：${prompt}`,

      durationMs: Math.round(
        performance.now() - startedAt,
      ),
    };

    this.tasks.push(task);

    return task;
  }

  findByUser(userId: number): AgentTask[] {
    return this.tasks.filter(
      (task) => task.userId === userId,
    );
  }

  getStats() {
    return {
      totalTasks: this.tasks.length,
      completedTasks: this.tasks.filter(
        (task) => task.status === 'completed',
      ).length,
    };
  }
}
