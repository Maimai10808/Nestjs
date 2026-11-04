import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { SearchService } from '../search/search.service.js';
import { AiService } from '../ai/ai.service.js';

import type { ResearchDto } from './dto/research.dto.js';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(
    AgentsService.name,
  );

  constructor(
    private readonly searchService: SearchService,
    private readonly aiService: AiService,
  ) {}

  async research(dto: ResearchDto) {
    const startTime = Date.now();

    this.logger.log(
      `开始执行 Deep Research：${dto.topic}`,
    );

    // 1. 调用外部搜索 API
    const searchResult = await this.searchService.search(
      dto.topic,
    );

    this.logger.log(
      `搜索完成，获取 ${searchResult.results.length} 条资料`,
    );

    // 2. 整理搜索资料
    const references = searchResult.results.map(
      (item, index) => {
        return [
          `资料 ${index + 1}`,
          `标题：${item.title}`,
          `链接：${item.url}`,
          `摘要：${item.snippet}`,
        ].join('\n');
      },
    );

    // 3. 构建 AI Prompt
    const prompt = `
你是一名专业的 AI 技术研究助手。

请根据以下研究主题和搜索资料，
生成一份结构清晰的技术研究报告。

研究主题：
${dto.topic}

搜索资料：
${references.join('\n\n')}

报告要求：

1. 介绍核心概念。
2. 分析技术架构。
3. 解释主要工作原理。
4. 总结技术优势与局限。
5. 给出实际应用场景。

请使用 Markdown 格式输出。
`;

    // 4. 调用外部 AI API
    const aiResult = await this.aiService.generate(
      prompt,
    );

    // 5. 计算执行耗时
    const durationMs = Date.now() - startTime;

    this.logger.log(
      `Deep Research 执行完成，耗时 ${durationMs}ms`,
    );

    // 6. 返回研究结果
    return {
      topic: dto.topic,

      model: aiResult.model,

      report: aiResult.output,

      references: searchResult.results,

      metadata: {
        tokensUsed: aiResult.tokensUsed,
        durationMs,
        referenceCount: searchResult.results.length,
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
