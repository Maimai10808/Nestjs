export type ResearchStage =
  | 'planning'
  | 'searching'
  | 'analyzing'
  | 'generating'
  | 'completed';

export interface ResearchProgress {
  taskId: string;

  stage: ResearchStage;

  progress: number;

  message: string;

  timestamp: string;
}
