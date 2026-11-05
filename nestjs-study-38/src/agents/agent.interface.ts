export interface Agent {
  id: number;
  name: string;
  description: string;
  model: string;
  enabled: boolean;
}

export type AgentStage =
  | 'planning'
  | 'searching'
  | 'analyzing'
  | 'generating'
  | 'completed';
