import { Injectable, BadRequestException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { OpenAiService } from '../models/openai.service.js';
import { ClaudeService } from '../models/claude.service.js';
import { GeminiService } from '../models/gemini.service.js';
import { AgentContextService } from './agent-context.service.js';

@Injectable()
export class AgentsService {
  constructor(private readonly moduleRef: ModuleRef) {}

  async generate(model: unknown, prompt: unknown) {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new BadRequestException('prompt 必须是非空字符串');
    }

    // 模型注册在 ModelsModule，get() 默认只搜索当前 AgentsModule。
    // 这里的三个 Token 在整个应用中唯一，明确使用跨模块查找。
    let service: OpenAiService | ClaudeService | GeminiService;
    switch (model) {
      case 'openai':
        service = this.moduleRef.get(OpenAiService, { strict: false });
        break;
      case 'claude':
        service = this.moduleRef.get(ClaudeService, { strict: false });
        break;
      case 'gemini':
        service = this.moduleRef.get(GeminiService, { strict: false });
        break;
      default:
        throw new BadRequestException('不支持的 AI 模型');
    }

    // 显式创建一次生成操作的 DI 子树。它不是 Express REQUEST 对象。
    const contextId = ContextIdFactory.create();
    const context = await this.moduleRef.resolve(AgentContextService, contextId);
    const repeated = await this.moduleRef.resolve(AgentContextService, contextId);

    return {
      ...service.generate(prompt),
      context: {
        ...context.getInfo(),
        reusedWithinOperation: context === repeated,
      },
    };
  }
}
