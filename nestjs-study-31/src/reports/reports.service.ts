import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  private readonly paragraph = `
LangGraph 是一个用于构建有状态 AI Agent 工作流的框架。

在复杂 AI Agent 系统中，开发者通常需要管理多个执行节点、
工具调用、状态转换以及任务执行历史。

通过状态图，我们可以将复杂 Agent 工作流拆分成多个独立节点。

例如，一个 Deep Research Agent 可能包含：

1. 用户问题分析。
2. 搜索任务规划。
3. 外部资料检索。
4. 研究资料整理。
5. AI 模型分析。
6. 研究报告生成。

这些节点之间通过状态转换连接。

在企业级 AI SaaS 平台中，这种架构可以帮助开发者
构建更加灵活、可维护的 Agent 系统。
`;

  // 生成指定规模的研究报告
  private generateReport(
    paragraphs: number,
  ) {
    const content = Array.from(
      { length: paragraphs },
      (_, index) => {
        return `## 研究章节 ${index + 1}\n\n${this.paragraph}`;
      },
    ).join('\n\n');

    return {
      taskId: `task-${paragraphs}`,
      title: 'LangGraph 技术研究报告',
      model: 'gpt-4.1',
      content,
      references: [
        {
          title: 'LangGraph Documentation',
          source: 'Official Documentation',
        },
        {
          title: 'AI Agent Architecture',
          source: 'Technical Research',
        },
      ],
      metadata: {
        paragraphs,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  // 小型报告
  getSmallReport() {
    return this.generateReport(2);
  }

  // 大型报告
  getLargeReport() {
    return this.generateReport(500);
  }

  // 超大型报告
  getHugeReport() {
    return this.generateReport(2000);
  }

  getStats() {
    return {
      reportTypes: [
        'small',
        'large',
        'huge',
      ],
      compressionSupported: true,
    };
  }
}
