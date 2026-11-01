import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAiService {
  generate(prompt: string) {
    return {
      provider: 'OpenAI',
      model: 'gpt',
      result: `OpenAI 正在处理：${prompt}`,
    };
  }
}
