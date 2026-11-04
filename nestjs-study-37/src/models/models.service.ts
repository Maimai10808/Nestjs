import { Injectable } from '@nestjs/common';

interface AiModel {
  id: string;
  provider: string;
  contextWindow: number;
  supportsTools: boolean;
}

@Injectable()
export class ModelsService {
  private readonly models: AiModel[] = [
    {
      id: 'gpt-4.1',
      provider: 'openai',
      contextWindow: 1000000,
      supportsTools: true,
    },
    {
      id: 'claude-sonnet',
      provider: 'anthropic',
      contextWindow: 200000,
      supportsTools: true,
    },
    {
      id: 'gpt-4.1-mini',
      provider: 'openai',
      contextWindow: 1000000,
      supportsTools: true,
    },
  ];

  findAll(): AiModel[] {
    return this.models;
  }
}
