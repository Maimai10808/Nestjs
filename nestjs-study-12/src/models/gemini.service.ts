import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  generate(prompt: string) {
    return {
      provider: 'Google',
      model: 'gemini',
      result: `Gemini 正在处理：${prompt}`,
    };
  }
}
