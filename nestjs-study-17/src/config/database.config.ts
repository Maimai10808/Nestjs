import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST ?? 'localhost',

  port: Number(
    process.env.DATABASE_PORT ?? 5432,
  ),

  name: process.env.DATABASE_NAME ?? 'agent_dev',
}));
