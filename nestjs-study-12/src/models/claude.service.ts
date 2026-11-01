import { Injectable } from '@nestjs/common';

@Injectable()
export class ClaudeService {
  generate(prompt: string) {
    return {
      provider: 'Anthropic',
      model: 'claude',
      result: `Claude 正在处理：${prompt}`,
    };
  }
}
