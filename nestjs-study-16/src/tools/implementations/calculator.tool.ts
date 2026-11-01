import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { AgentTool } from '../decorators/agent-tool.decorator.js';

import type {
  AgentTool as IAgentTool,
} from '../interfaces/agent-tool.interface.js';

@Injectable()
@AgentTool({
  name: 'calculator',
  description: '计算两个数字的加法',
})
export class CalculatorTool implements IAgentTool {
  async execute(input: string): Promise<unknown> {
    const parts = input.trim().split(/\s+/).map(Number);

    if (
      parts.length !== 2 ||
      parts.some((value) => !Number.isFinite(value))
    ) {
      throw new BadRequestException(
        '请输入两个数字，例如：10 20',
      );
    }

    const [a, b] = parts;

    return {
      tool: 'calculator',
      expression: `${a} + ${b}`,
      result: a + b,
    };
  }
}
