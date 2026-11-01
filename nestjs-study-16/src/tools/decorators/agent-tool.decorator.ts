import { DiscoveryService } from '@nestjs/core';

export interface AgentToolMetadata {
  name: string;
  description: string;
}

export const AgentTool =
  DiscoveryService.createDecorator<AgentToolMetadata>();
