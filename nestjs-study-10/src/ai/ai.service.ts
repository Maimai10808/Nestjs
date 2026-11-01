import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  AI_MODEL,
  AI_OPTIONS,
} from './constants/ai.tokens.js';

import type { AiModel } from './interfaces/ai-model.interface.js';

import type { AiModuleOptions } from './interfaces/ai-options.interface.js';

@Injectable()
export class AiService {
  constructor(
    @Inject(AI_MODEL)
    private readonly model: AiModel,

    @Inject(AI_OPTIONS)
    private readonly options: AiModuleOptions,
  ) {}

  getConfig() {
    return {
      model: this.model.getName(),
      timeout: this.options.timeout,
      maxRetries: this.options.maxRetries,
    };
  }

  async generate(prompt: string) {
    const result = await this.model.generate(prompt);

    return {
      provider: this.model.getName(),
      prompt,
      result,
      config: this.getConfig(),
    };
  }
}
