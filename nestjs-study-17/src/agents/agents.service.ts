import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgentsService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  getConfiguration() {
    return {
      provider: this.configService.get<string>(
        'ai.provider',
      ),

      model: this.configService.get<string>(
        'ai.model',
      ),

      temperature: this.configService.get<number>(
        'ai.temperature',
      ),

      timeout: this.configService.get<number>(
        'ai.timeout',
      ),
    };
  }

  async generate(prompt: unknown) {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new BadRequestException('prompt 必须是非空字符串');
    }
    const config = this.getConfiguration();

    // 模拟 AI 模型调用
    return {
      prompt,

      provider: config.provider,

      model: config.model,

      temperature: config.temperature,

      result: `这是使用 ${config.provider} 模型生成的模拟回答：${prompt}`,

      timestamp: new Date().toISOString(),
    };
  }
}
