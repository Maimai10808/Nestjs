import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { ModuleRef } from '@nestjs/core';

import { OpenAiService } from '../models/openai.service.js';
import { ClaudeService } from '../models/claude.service.js';
import { GeminiService } from '../models/gemini.service.js';

@Injectable()
export class AgentsService {
  constructor(
    private readonly moduleRef: ModuleRef,
  ) {}

  generate(model: string, prompt: string) {
    switch (model) {
      case 'openai': {
        const service = this.moduleRef.get(OpenAiService);

        return service.generate(prompt);
      }

      case 'claude': {
        const service = this.moduleRef.get(ClaudeService);

        return service.generate(prompt);
      }

      case 'gemini': {
        const service = this.moduleRef.get(GeminiService);

        return service.generate(prompt);
      }

      default:
        throw new BadRequestException('不支持的 AI 模型');
    }
  }
}
