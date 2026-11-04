import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type {
  ResearchReport,
} from './report.interface.js';

@Injectable()
export class ReportsService {
  private readonly reports: ResearchReport[] = [
    {
      id: 1,
      title: 'LangGraph 技术研究报告',
      description:
        '深入研究 LangGraph 的核心架构与 Agent 工作流',
      content: `
LangGraph 是一个用于构建有状态 AI Agent
工作流的框架。

它允许开发者通过状态图组织复杂的 AI 工作流。

例如，一个 Deep Research Agent 可以包含：

1. 用户问题分析
2. 搜索任务规划
3. 外部资料检索
4. 研究资料整理
5. AI 模型分析
6. 研究报告生成

这些步骤可以通过状态图连接起来。
      `.trim(),
      model: 'gpt-4.1',
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'NestJS 企业级架构研究',
      description:
        '研究 NestJS 的模块化架构与依赖注入机制',
      content: `
NestJS 是一个基于 Node.js 的后端框架。

它使用 TypeScript，并提供模块化架构。

核心概念包括：

1. Module
2. Controller
3. Provider
4. Dependency Injection
5. Guard
6. Interceptor
7. Pipe

这些机制可以帮助开发者构建可维护的后端系统。
      `.trim(),
      model: 'claude-sonnet',
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'AI Agent 工作流研究',
      description:
        '分析 Agent 的工具调用、任务规划与执行机制',
      content: `
AI Agent 不只是简单调用大语言模型。

它通常还需要：

1. 任务规划
2. 工具调用
3. 状态管理
4. 错误恢复
5. 执行结果保存

复杂 Agent 系统还可能结合 LangGraph、
BullMQ、Redis 和数据库实现完整的任务执行系统。
      `.trim(),
      model: 'gpt-4.1-mini',
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
  ];

  // 查询全部研究报告
  findAll(): ResearchReport[] {
    return this.reports;
  }

  // 查询指定研究报告
  findOne(id: number): ResearchReport {
    const report = this.reports.find(
      (item) => item.id === id,
    );

    if (!report) {
      throw new NotFoundException(
        '研究报告不存在',
      );
    }

    return report;
  }

  // 查询报告总数
  count(): number {
    return this.reports.length;
  }
}
