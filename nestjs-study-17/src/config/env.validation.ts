import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.number()
    .port()
    .default(3000),

  AI_PROVIDER: Joi.string()
    .valid('openai', 'claude')
    .required(),

  AI_MODEL: Joi.string()
    .min(1)
    .required(),

  AI_TEMPERATURE: Joi.number()
    .min(0)
    .max(2)
    .default(0.7),

  AI_MAX_TOKENS: Joi.number().integer().min(1).max(1000000).default(4096),

  AI_TIMEOUT: Joi.number()
    .integer()
    .min(1000)
    .max(120000)
    .default(30000),

  DATABASE_HOST: Joi.string()
    .required(),

  DATABASE_PORT: Joi.number()
    .port()
    .default(5432),

  DATABASE_NAME: Joi.string()
    .required(),

  REDIS_HOST: Joi.string()
    .required(),

  REDIS_PORT: Joi.number()
    .port()
    .default(6379),
});
