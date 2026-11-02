import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('Runtime model selection with ModuleRef', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it.each([
    ['openai', 'OpenAI', 'gpt'],
    ['claude', 'Anthropic', 'claude'],
    ['gemini', 'Google', 'gemini'],
  ])('resolves the %s provider from ModelsModule', async (model, provider, outputModel) => {
    const response = await request(app.getHttpServer())
      .post('/agents/generate')
      .send({ model, prompt: '你好' })
      .expect(201);
    expect(response.body).toMatchObject({ provider, model: outputModel });
    expect(response.body.result).toContain('你好');
    expect(response.body.context.instanceId).toEqual(expect.any(String));
    expect(response.body.context.reusedWithinOperation).toBe(true);
  });

  it('creates a new scoped context for each generation operation', async () => {
    const first = await request(app.getHttpServer()).post('/agents/generate').send({ model: 'openai', prompt: 'first' }).expect(201);
    const second = await request(app.getHttpServer()).post('/agents/generate').send({ model: 'openai', prompt: 'second' }).expect(201);
    expect(first.body.context.instanceId).not.toBe(second.body.context.instanceId);
  });

  it('rejects unsupported models and invalid prompts before model execution', async () => {
    await request(app.getHttpServer())
      .post('/agents/generate')
      .send({ model: 'unknown', prompt: '你好' })
      .expect(400);
    for (const prompt of [undefined, '', '   ', 42]) {
      await request(app.getHttpServer())
        .post('/agents/generate')
        .send({ model: 'openai', prompt })
        .expect(400);
    }
  });
});
