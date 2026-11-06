export interface ResearchReport {
  id: number;

  title: string;

  description: string;

  content: string;

  model: string;

  status: 'completed' | 'generating';

  createdAt: string;
}
