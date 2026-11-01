import { Injectable } from '@nestjs/common';

import type { AiModel } from '../interfaces/ai-model.interface.js';

@Injectable()
export class ClaudeService implements AiModel {
  getName(): string {
    return 'Claude';
  }

  async generate(prompt: string): Promise<string> {
    return `[Claude 模拟响应] ${prompt}`;
  }
}
