export interface Agent {
  id: number;
  name: string;
  description: string;
  model: string;
  enabled: boolean;
}

export interface AgentExecution {
  id: number;
  agentId: number;
  agentName: string;
  trigger: 'manual' | 'cron' | 'interval' | 'delayed';
  status: 'completed' | 'failed';
  result: string;
  executedAt: string;
}
