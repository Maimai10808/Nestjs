import { Injectable } from '@nestjs/common';

import type { AiModel } from '../interfaces/ai-model.interface.js';

@Injectable()
export class OpenAiService implements AiModel {
  getName(): string {
    return 'OpenAI';
  }

  async generate(prompt: string): Promise<string> {
    return `[OpenAI 模拟响应] ${prompt}`;
  }
}
