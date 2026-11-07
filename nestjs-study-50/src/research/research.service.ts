import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { ModelsService } from '../models/models.service.js';

import { ReportStorageService } from './report-storage.service.js';

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(
    ResearchService.name,
  );

  constructor(
    private readonly modelsService: ModelsService,
    private readonly storageService: ReportStorageService,
  ) {}

  async generateReport(
    topic: string,
  ): Promise<string> {
    const model =
      this.modelsService.getDefaultModel();

    this.logger.log(
      `开始研究：${topic}`,
    );

    this.logger.log(
      `使用模型：${model.id}`,
    );

    // 模拟 AI Agent Planning
    await this.sleep(500);

    const plan = [
      '明确研究问题',
      '分析核心技术概念',
      '比较不同实现方案',
      '总结工程实践',
    ];

    // 模拟 AI Agent Analysis
    await this.sleep(500);

    const summary =
      `本报告对《${topic}》进行了模拟研究分析。`;

    // 模拟报告生成
    await this.sleep(500);

    const markdown = `
# ${topic}

## 一、研究概述

${summary}

## 二、研究计划

${plan
  .map((item, index) => `${index + 1}. ${item}`)
  .join('\n')}

## 三、技术分析

本报告由模拟 AI Research Agent 生成。

实际项目中，可以使用 LangGraph 实现：
- Planning
- Tool Calling
- Research
- Report Generation

## 四、使用模型

${model.id}

## 五、总结

本次研究任务执行完成。
`;

    const filePath =
      await this.storageService.saveMarkdown(
        markdown,
      );

    this.logger.log(
      '研究任务完成',
    );

    return filePath;
  }

  private sleep(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
