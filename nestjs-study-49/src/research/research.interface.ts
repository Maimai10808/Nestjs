export type ResearchStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed';

export interface ResearchTask {
  id: string;

  topic: string;

  model: string;

  status: ResearchStatus;

  progress: number;

  result: string | null;

  createdAt: string;

  updatedAt: string;
}
