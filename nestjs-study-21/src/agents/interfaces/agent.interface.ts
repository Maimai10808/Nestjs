export interface Agent {
  id: number;

  name: string;

  description: string;

  model: string;

  temperature: number;

  maxSteps: number;

  tools: string[];

  enabled: boolean;

  createdAt: Date;

  updatedAt: Date;
}
