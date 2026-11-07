import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelsService {
  getDefaultModel() {
    return {
      id: 'gpt-4.1',
      provider: 'openai',
    };
  }

  getAvailableModels() {
    return [
      {
        id: 'gpt-4.1',
        provider: 'openai',
      },
      {
        id: 'claude-sonnet',
        provider: 'anthropic',
      },
    ];
  }
}
