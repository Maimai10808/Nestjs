import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelsService {
  findAll() {
    return [
      {
        id: 'gpt-4.1',
        provider: 'openai',
      },
      {
        id: 'claude-sonnet',
        provider: 'anthropic',
      },
      {
        id: 'gpt-4.1-mini',
        provider: 'openai',
      },
    ];
  }
}
