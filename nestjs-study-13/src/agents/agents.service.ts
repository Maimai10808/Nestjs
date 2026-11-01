import { Injectable } from '@nestjs/common';

import { LazyModuleLoader } from '@nestjs/core';

import { ChatService } from '../chat/chat.service.js';

export type AgentType = 'chat' | 'research' | 'coding';

@Injectable()
export class AgentsService {
  constructor(
    private readonly lazyModuleLoader: LazyModuleLoader,
    private readonly chatService: ChatService,
  ) {}

  async run(type: AgentType, prompt: string) {
    switch (type) {
      case 'chat':
        return this.chatService.run(prompt);

      case 'research': {
        // 1. 动态导入模块
        const { ResearchModule } =
          await import('../research/research.module.js');

        // 2. 按需加载 NestJS 模块
        const moduleRef = await this.lazyModuleLoader.load(
          () => ResearchModule,
        );

        // 3. 获取模块中的 Service
        const { ResearchService } =
          await import('../research/research.service.js');

        const researchService = moduleRef.get(
          ResearchService,
          { strict: false },
        );

        // 4. 执行业务
        return researchService.run(prompt);
      }

      case 'coding': {
        const { CodingModule } =
          await import('../coding/coding.module.js');

        const moduleRef = await this.lazyModuleLoader.load(
          () => CodingModule,
        );

        const { CodingService } =
          await import('../coding/coding.service.js');

        const codingService = moduleRef.get(
          CodingService,
          { strict: false },
        );

        return codingService.run(prompt);
      }

      default:
        throw new Error('Unsupported agent type');
    }
  }
}
