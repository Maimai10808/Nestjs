import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST ?? 'localhost',

  port: Number(process.env.DATABASE_PORT ?? 5433),

  username: process.env.DATABASE_USERNAME ?? 'study',

  password: process.env.DATABASE_PASSWORD ?? '',

  database: process.env.DATABASE_NAME ?? 'agent_study',
}));
