export const RESEARCH_PATTERNS = {
  ANALYZE: 'research.analyze',

  MODELS: 'research.models',

  SLOW: 'research.slow',

  SUBMITTED: 'research.submitted',
} as const;

export interface ResearchRequest {
  topic: string;

  model: 'gpt-4.1' | 'claude-sonnet';
}

export interface ResearchResult {
  taskId: string;

  topic: string;

  model: string;

  summary: string;

  durationMs: number;

  completedAt: string;
}

export interface ResearchSubmittedEvent {
  taskId: string;

  topic: string;

  submittedAt: string;
}
