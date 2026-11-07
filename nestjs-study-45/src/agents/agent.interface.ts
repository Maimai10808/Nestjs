export type AgentStatus =
  | 'idle'
  | 'planning'
  | 'analyzing'
  | 'waiting_approval'
  | 'modifying'
  | 'testing'
  | 'completed'
  | 'cancelled'
  | 'failed';

export interface AgentTask {
  id: string;

  clientId: string;

  prompt: string;

  status: AgentStatus;

  progress: number;

  createdAt: string;

  updatedAt: string;
}

export interface AgentProgress {
  taskId: string;

  status: AgentStatus;

  progress: number;

  message: string;
}
