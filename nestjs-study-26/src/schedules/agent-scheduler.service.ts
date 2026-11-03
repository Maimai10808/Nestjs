import {
  Injectable,
  Logger,
} from '@nestjs/common';

import {
  Cron,
  Interval,
  Timeout,
} from '@nestjs/schedule';

import { AgentsService } from '../agents/agents.service.js';

@Injectable()
export class AgentSchedulerService {
  private readonly logger = new Logger(
    AgentSchedulerService.name,
  );

  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 每天上午 9 点执行 Deep Research Agent
  @Cron('0 0 9 * * *', {
    name: 'daily-research',
    timeZone: 'Asia/Shanghai',
    waitForCompletion: true,
  })
  async dailyResearch() {
    this.logger.log('开始执行每日 AI 研究任务');

    await this.agentsService.runAgent(1, 'cron');
  }

  // 每隔 30 秒检查 Agent 任务
  @Interval(30000)
  checkAgentTasks() {
    const executions = this.agentsService.findExecutions();

    this.logger.log(
      `当前累计执行记录：${executions.length}`,
    );
  }

  // 应用启动 10 秒后执行一次
  @Timeout(10000)
  startupCheck() {
    this.logger.log('Agent 调度系统初始化检查完成');
  }
}
