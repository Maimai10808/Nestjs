import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  SchedulerRegistry,
} from '@nestjs/schedule';

import {
  CronJob,
  CronTime,
} from 'cron';

import { AgentsService } from '../agents/agents.service.js';

import type { CreateCronDto } from './dto/create-cron.dto.js';

import type { CreateDelayedDto } from './dto/create-delayed.dto.js';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(
    SchedulesService.name,
  );

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly agentsService: AgentsService,
  ) {}

  // 创建动态 Cron 任务
  createCron(dto: CreateCronDto) {
    const existingJobs =
      this.schedulerRegistry.getCronJobs();

    if (existingJobs.has(dto.name)) {
      throw new ConflictException('任务名称已存在');
    }

    // 检查 Agent 是否存在且已启用
    const agent = this.agentsService
      .findAll()
      .find(
        (item) =>
          item.id === dto.agentId &&
          item.enabled,
      );

    if (!agent) {
      throw new NotFoundException(
        'Agent 不存在或未启用',
      );
    }

    // 验证 Cron 表达式
    try {
      new CronTime(dto.cronExpression);
    } catch {
      throw new BadRequestException(
        'Cron 表达式不合法',
      );
    }

    // 创建 CronJob
    const job = new CronJob(
      dto.cronExpression,
      async () => {
        try {
          this.logger.log(
            `动态任务 ${dto.name} 开始执行`,
          );

          await this.agentsService.runAgent(
            dto.agentId,
            'cron',
          );
        } catch (error) {
          this.logger.error(
            `动态任务 ${dto.name} 执行失败`,
            error instanceof Error
              ? error.stack
              : String(error),
          );
        }
      },
      null,
      false,
      'Asia/Shanghai',
    );

    // 注册任务
    this.schedulerRegistry.addCronJob(
      dto.name,
      job,
    );

    // 启动任务
    job.start();

    return {
      message: 'Cron 任务创建成功',
      name: dto.name,
      agentId: dto.agentId,
      cronExpression: dto.cronExpression,
      nextRun: job.nextDate().toISO(),
    };
  }

  // 查询所有 Cron 任务
  findAllCrons() {
    const jobs =
      this.schedulerRegistry.getCronJobs();

    return Array.from(jobs.entries()).map(
      ([name, job]) => {
        let nextRun: string | null = null;

        try {
          nextRun = job.nextDate().toISO();
        } catch {
          nextRun = null;
        }

        return {
          name,
          running: job.isActive,
          nextRun,
        };
      },
    );
  }

  // 暂停 Cron
  pauseCron(name: string) {
    const job = this.getCronJob(name);

    job.stop();

    return {
      message: '任务已暂停',
      name,
    };
  }

  // 恢复 Cron
  resumeCron(name: string) {
    const job = this.getCronJob(name);

    job.start();

    return {
      message: '任务已恢复',
      name,
      nextRun: job.nextDate().toISO(),
    };
  }

  // 删除 Cron
  deleteCron(name: string) {
    const job = this.getCronJob(name);

    job.stop();

    this.schedulerRegistry.deleteCronJob(name);

    return {
      message: '任务已删除',
      name,
    };
  }

  // 创建一次性延迟任务
  createDelayed(dto: CreateDelayedDto) {
    const existingTimeouts =
      this.schedulerRegistry.getTimeouts();

    if (existingTimeouts.includes(dto.name)) {
      throw new ConflictException(
        '延迟任务名称已存在',
      );
    }

    const agent = this.agentsService
      .findAll()
      .find(
        (item) =>
          item.id === dto.agentId &&
          item.enabled,
      );

    if (!agent) {
      throw new NotFoundException(
        'Agent 不存在或未启用',
      );
    }

    const timeout = setTimeout(() => {
      // 一次性任务触发后，先移除注册记录
      this.schedulerRegistry.deleteTimeout(
        dto.name,
      );

      void this.agentsService
        .runAgent(dto.agentId, 'delayed')
        .catch((error: unknown) => {
          this.logger.error(
            `延迟任务 ${dto.name} 执行失败`,
            error instanceof Error
              ? error.stack
              : String(error),
          );
        });
    }, dto.delayMs);

    this.schedulerRegistry.addTimeout(
      dto.name,
      timeout,
    );

    return {
      message: '延迟任务创建成功',
      name: dto.name,
      agentId: dto.agentId,
      delayMs: dto.delayMs,
      executeAt: new Date(
        Date.now() + dto.delayMs,
      ).toISOString(),
    };
  }

  // 查询所有 Interval
  findAllIntervals() {
    return this.schedulerRegistry.getIntervals();
  }

  // 查询所有 Timeout
  findAllTimeouts() {
    return this.schedulerRegistry.getTimeouts();
  }

  // 内部辅助方法
  private getCronJob(name: string): CronJob {
    const jobs =
      this.schedulerRegistry.getCronJobs();

    if (!jobs.has(name)) {
      throw new NotFoundException(
        `Cron 任务 ${name} 不存在`,
      );
    }

    return this.schedulerRegistry.getCronJob(name);
  }
}
