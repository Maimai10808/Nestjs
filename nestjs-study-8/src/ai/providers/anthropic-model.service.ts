import { Injectable } from '@nestjs/common';

import type { AIModel } from '../interfaces/ai-model.interface.js';

@Injectable()
export class AnthropicModelService implements AIModel {
  name = 'Anthropic Claude';

  async generate(prompt: string): Promise<string> {
    return `[Anthropic] 已处理你的请求：${prompt}`;
  }
}
