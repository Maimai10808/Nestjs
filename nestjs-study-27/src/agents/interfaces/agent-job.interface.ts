export interface AgentJobData {
  agentId: number;
  userId: number;
  input: string;
}

export interface AgentJobResult {
  agentId: number;
  userId: number;
  output: string;
  completedAt: string;
}
