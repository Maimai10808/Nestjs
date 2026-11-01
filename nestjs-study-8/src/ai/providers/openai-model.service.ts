import { Injectable } from '@nestjs/common';

import type { AIModel } from '../interfaces/ai-model.interface.js';

@Injectable()
export class OpenAIModelService implements AIModel {
  name = 'OpenAI GPT';

  async generate(prompt: string): Promise<string> {
    return `[OpenAI] 已处理你的请求：${prompt}`;
  }
}
