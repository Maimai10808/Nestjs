import {
  Processor,
  WorkerHost,
  OnWorkerEvent,
} from '@nestjs/bullmq';

import {
  Logger,
} from '@nestjs/common';

import { Job } from 'bullmq';

import type {
  AgentJobData,
  AgentJobResult,
} from './interfaces/agent-job.interface.js';

@Processor('agent-tasks', {
  concurrency: 3,
})
export class AgentProcessor extends WorkerHost {
  private readonly logger = new Logger(
    AgentProcessor.name,
  );

  async process(
    job: Job<AgentJobData, AgentJobResult, string>,
  ): Promise<AgentJobResult> {
    this.logger.log(
      `开始执行任务：${job.id}`,
    );

    switch (job.name) {
      case 'execute-agent':
        return this.executeAgent(job);

      default:
        throw new Error(
          `未知任务类型：${job.name}`,
        );
    }
  }

  private async executeAgent(
    job: Job<AgentJobData, AgentJobResult, string>,
  ): Promise<AgentJobResult> {
    const { agentId, userId, input } = job.data;

    this.logger.log(
      `Agent ${agentId} 开始执行，用户 ${userId}`,
    );

    // 根据 Agent 类型模拟不同执行时间
    const durationMap: Record<number, number> = {
      1: 10000,
      2: 5000,
      3: 15000,
    };

    const duration = durationMap[agentId];

    if (duration === undefined) {
      throw new Error(`不支持的 Agent ID：${agentId}`);
    }

    const steps = 10;

    for (let i = 1; i <= steps; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, duration / steps);
      });

      const progress = i * 10;

      await job.updateProgress(progress);

      this.logger.log(
        `任务 ${job.id} 当前进度：${progress}%`,
      );
    }

    const result: AgentJobResult = {
      agentId,
      userId,
      output: `Agent ${agentId} 已完成任务：${input}`,
      completedAt: new Date().toISOString(),
    };

    this.logger.log(
      `任务 ${job.id} 执行完成`,
    );

    return result;
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(
      `任务 ${job.id} 开始处理`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `任务 ${job.id} 执行成功`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(
    job: Job | undefined,
    error: Error,
  ) {
    this.logger.error(
      `任务 ${job?.id ?? 'unknown'} 执行失败：${error.message}`,
    );
  }
}
