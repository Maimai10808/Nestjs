import { Injectable } from '@nestjs/common';

import { AgentTool } from '../decorators/agent-tool.decorator.js';

import type {
  AgentTool as IAgentTool,
} from '../interfaces/agent-tool.interface.js';

@Injectable()
@AgentTool({
  name: 'weather',
  description: '查询城市天气',
})
export class WeatherTool implements IAgentTool {
  async execute(input: string): Promise<unknown> {
    return {
      tool: 'weather',
      city: input,
      temperature: 23,
      condition: '晴天',
      mock: true,
    };
  }
}
