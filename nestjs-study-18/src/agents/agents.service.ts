import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import type { ConfigType } from '@nestjs/config';

import agentConfig from '../config/agent.config.js';

@Injectable()
export class AgentsService {
  constructor(
    @Inject(agentConfig.KEY)
    private readonly config: ConfigType<typeof agentConfig>,
  ) {}

  // 获取 Agent 配置
  getConfig() {
    return {
      maxSteps: this.config.maxSteps,
      timeoutMs: this.config.timeoutMs,
      maxConcurrent: this.config.maxConcurrent,
    };
  }

  // 获取执行限制
  getLimits() {
    return {
      maxSteps: this.config.maxSteps,
      timeoutSeconds: this.config.timeoutMs / 1000,
      maxConcurrent: this.config.maxConcurrent,
    };
  }

  // 模拟 Agent 执行
  async run(prompt: string) {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new BadRequestException('Prompt 不能为空');
    }

    return {
      message: 'Agent 执行成功（模拟）',

      prompt,

      execution: {
        maxSteps: this.config.maxSteps,
        timeoutMs: this.config.timeoutMs,
        maxConcurrent: this.config.maxConcurrent,
      },

      result: `AI Agent 已接收任务：${prompt}`,
    };
  }
}
