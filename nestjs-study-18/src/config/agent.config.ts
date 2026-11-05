import { registerAs } from '@nestjs/config';

export default registerAs('agent', () => ({
  maxSteps: Number(
    process.env.AGENT_MAX_STEPS ?? 20,
  ),

  timeoutMs: Number(
    process.env.AGENT_TIMEOUT_MS ?? 30000,
  ),

  maxConcurrent: Number(
    process.env.AGENT_MAX_CONCURRENT ?? 5,
  ),
}));
