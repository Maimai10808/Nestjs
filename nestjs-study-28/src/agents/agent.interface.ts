export interface Agent {
  id: number;
  name: string;
  model: string;
  enabled: boolean;
}

export interface AgentExecution {
  id: number;
  agentId: number;
  status: 'completed' | 'failed';
  result: string | null;
  durationMs: number;
  executedAt: string;
}
