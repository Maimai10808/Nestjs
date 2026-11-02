import { registerAs } from '@nestjs/config';

export default registerAs('quota', () => ({
  dailyLimit: Number(
    process.env.QUOTA_DAILY_LIMIT ?? 100,
  ),

  maxTokensPerRequest: Number(
    process.env.QUOTA_MAX_TOKENS_PER_REQUEST ?? 8000,
  ),
}));
