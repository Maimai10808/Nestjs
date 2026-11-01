import {
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';

import { DiscoveryService } from '@nestjs/core';

import {
  AgentTool,
  type AgentToolMetadata,
} from './decorators/agent-tool.decorator.js';

import type {
  AgentTool as IAgentTool,
} from './interfaces/agent-tool.interface.js';

interface RegisteredTool {
  metadata: AgentToolMetadata;
  instance: IAgentTool;
}

@Injectable()
export class ToolRegistryService
  implements OnApplicationBootstrap
{
  private readonly tools = new Map<string, RegisteredTool>();

  constructor(
    private readonly discoveryService: DiscoveryService,
  ) {}

  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();

    for (const provider of providers) {
      const metadata =
        this.discoveryService.getMetadataByDecorator(
          AgentTool,
          provider,
        );

      if (!metadata) {
        continue;
      }

      const instance = provider.instance as
        | IAgentTool
        | undefined;

      if (!instance || typeof instance.execute !== 'function') {
        throw new Error(
          `Agent Tool "${metadata.name}" 没有可用的 execute() 方法`,
        );
      }

      if (this.tools.has(metadata.name)) {
        throw new Error(
          `重复的 Agent Tool 名称：${metadata.name}`,
        );
      }

      this.tools.set(metadata.name, {
        metadata,
        instance,
      });
    }

    console.log(
      '发现的 Agent Tools:',
      [...this.tools.keys()],
    );
  }

  getTools() {
    return [...this.tools.values()].map(({ metadata }) => metadata);
  }

  getTool(name: string): IAgentTool | undefined {
    return this.tools.get(name)?.instance;
  }
}
