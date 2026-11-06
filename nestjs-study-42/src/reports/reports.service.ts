import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type {
  ResearchReport,
} from './report.interface.js';

@Injectable()
export class ReportsService {
  private readonly reports:
    ResearchReport[] = [
      {
        id: 1,

        title:
          'LangGraph 技术研究报告',

        description:
          '研究 LangGraph 的核心架构与工作流',

        content: `
LangGraph 是一个用于构建有状态
AI Agent 工作流的框架。

一个 Deep Research Agent 可以包含：

1. 用户问题分析
2. 搜索任务规划
3. 外部资料检索
4. AI 模型分析
5. 研究报告生成
        `.trim(),

        model: 'gpt-4.1',

        status: 'completed',

        createdAt:
          new Date().toISOString(),
      },

      {
        id: 2,

        title:
          'NestJS Agent 后端架构',

        description:
          '研究 NestJS 如何构建企业级 Agent 服务',

        content: `
NestJS 提供模块化后端架构。

核心能力包括：

1. Module
2. Controller
3. Provider
4. Guard
5. Interceptor
6. Middleware
7. Dependency Injection
        `.trim(),

        model: 'claude-sonnet',

        status: 'completed',

        createdAt:
          new Date().toISOString(),
      },

      {
        id: 3,

        title:
          'AI Agent 安全实践',

        description:
          '研究 AI SaaS 中的认证、授权和数据保护',

        content: `
AI Agent SaaS 需要多层安全机制。

例如：

1. JWT Authentication
2. RBAC Authorization
3. AES-256-GCM Encryption
4. bcrypt Password Hashing
5. Helmet Security Headers
        `.trim(),

        model: 'gpt-4.1-mini',

        status: 'completed',

        createdAt:
          new Date().toISOString(),
      },
    ];

  findAll(): ResearchReport[] {
    return this.reports;
  }

  findOne(
    id: number,
  ): ResearchReport {
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

  count(): number {
    return this.reports.length;
  }
}
