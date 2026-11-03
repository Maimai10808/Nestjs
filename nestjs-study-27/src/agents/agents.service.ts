import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';

import { Queue } from 'bullmq';

import type {
  AgentJobData,
  AgentJobResult,
} from './interfaces/agent-job.interface.js';

import type { RunAgentDto } from './dto/run-agent.dto.js';

@Injectable()
export class AgentsService {
  constructor(
    @InjectQueue('agent-tasks')
    private readonly agentQueue: Queue<
      AgentJobData,
      AgentJobResult,
      string
    >,
  ) {}

  // 1. 提交 AI Agent 任务
  async runAgent(dto: RunAgentDto) {
    const job = await this.agentQueue.add(
      'execute-agent',

      {
        agentId: dto.agentId,
        userId: dto.userId,
        input: dto.input,
      },

      {
        delay: dto.delay ?? 0,

        priority: dto.priority,

        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 2000,
        },

        removeOnComplete: 100,

        removeOnFail: 100,
      },
    );

    return {
      jobId: job.id,
      status: await job.getState(),
      message: 'AI Agent 任务已提交',
    };
  }

  // 2. 查询任务状态
  async getJob(jobId: string) {
    const job = await this.agentQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException('任务不存在');
    }

    const state = await job.getState();

    return {
      jobId: job.id,
      name: job.name,
      state,
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      data: job.data,
      result: job.returnvalue,
      failedReason: job.failedReason,
      createdAt: new Date(job.timestamp).toISOString(),
    };
  }

  // 3. 查询任务结果
  async getJobResult(jobId: string) {
    const job = await this.agentQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException('任务不存在');
    }

    const state = await job.getState();

    if (state !== 'completed') {
      return {
        jobId,
        state,
        message: '任务尚未完成',
      };
    }

    return {
      jobId,
      state,
      result: job.returnvalue,
    };
  }

  // 4. 查询队列统计
  async getQueueStats() {
    const counts = await this.agentQueue.getJobCounts(
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
      'paused',
    );

    return {
      queue: 'agent-tasks',
      counts,
    };
  }

  // 5. 重试失败任务
  async retryJob(jobId: string) {
    const job = await this.agentQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException('任务不存在');
    }

    const state = await job.getState();

    if (state !== 'failed') {
      throw new BadRequestException(
        '只有失败的任务才能手动重试',
      );
    }

    try {
      await job.retry();
    } catch {
      throw new ConflictException(
        '任务重试失败，请检查任务状态',
      );
    }

    return {
      jobId,
      message: '任务已重新加入队列',
    };
  }

  // 6. 暂停队列
  async pauseQueue() {
    await this.agentQueue.pause();

    return {
      message: '队列已暂停',
    };
  }

  // 7. 恢复队列
  async resumeQueue() {
    await this.agentQueue.resume();

    return {
      message: '队列已恢复',
    };
  }
}
