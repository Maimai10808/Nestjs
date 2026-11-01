import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ToolRegistryService } from '../tools/tool-registry.service.js';

@Injectable()
export class AgentService {
  constructor(
    private readonly toolRegistry: ToolRegistryService,
  ) {}

  getAvailableTools() {
    return this.toolRegistry.getTools();
  }

  async executeTool(name: string, input: string) {
    const tool = this.toolRegistry.getTool(name);

    if (!tool) {
      throw new NotFoundException(
        `Agent Tool "${name}" 不存在`,
      );
    }

    const result = await tool.execute(input);

    return {
      tool: name,
      result,
    };
  }
}
