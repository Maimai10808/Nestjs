import { Injectable } from '@nestjs/common';

import { AgentTool } from '../decorators/agent-tool.decorator.js';

import type {
  AgentTool as IAgentTool,
} from '../interfaces/agent-tool.interface.js';

@Injectable()
@AgentTool({
  name: 'search',
  description: '返回本地模拟搜索结果',
})
export class SearchTool implements IAgentTool {
  async execute(input: string): Promise<unknown> {
    return {
      tool: 'search',
      query: input,
      mock: true,
      results: [
        {
          title: 'NestJS Documentation',
          summary: 'NestJS 是一个 Node.js 服务端框架',
        },
      ],
    };
  }
}
