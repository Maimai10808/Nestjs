import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  provider: process.env.AI_PROVIDER ?? 'openai',

  model: process.env.AI_MODEL ?? 'gpt-4.1',

  temperature: Number(
    process.env.AI_TEMPERATURE ?? 0.7,
  ),

  maxTokens: Number(
    process.env.AI_MAX_TOKENS ?? 4096,
  ),
}));
