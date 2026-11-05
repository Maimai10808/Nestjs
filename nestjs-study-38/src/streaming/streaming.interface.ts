export interface AgentStreamData {
  stage: string;
  message: string;
  progress?: number;
  timestamp: string;
}

export interface TokenStreamData {
  token: string;
  index: number;
}

export interface AgentCompletedData {
  message: string;
  completedAt: string;
}
