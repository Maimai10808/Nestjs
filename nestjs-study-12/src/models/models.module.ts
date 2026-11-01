import { Module } from '@nestjs/common';

import { OpenAiService } from './openai.service.js';
import { ClaudeService } from './claude.service.js';
import { GeminiService } from './gemini.service.js';

@Module({
  providers: [
    OpenAiService,
    ClaudeService,
    GeminiService,
  ],

  exports: [
    OpenAiService,
    ClaudeService,
    GeminiService,
  ],
})
export class ModelsModule {}
