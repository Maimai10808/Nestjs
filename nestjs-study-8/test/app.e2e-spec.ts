import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { AI_CONFIG } from '../dist/ai/tokens/ai.tokens.js';

describe('自定义 Provider：模型选择与实例别名', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const fixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = fixture.createNestApplication();
    await app.init();
  });

  it('配置、模型与生成使用同一 Provider 配置', async () => {
    const config = await request(app.getHttpServer())
      .get('/ai/config')
      .expect(200);
    expect(config.body.config.provider).toBe('openai');
    const model = await request(app.getHttpServer())
      .get('/ai/model')
      .expect(200);
    expect(model.body.model).toBe('OpenAI GPT');
    const result = await request(app.getHttpServer())
      .post('/ai/generate')
      .send({ prompt: 'Hello' })
      .expect(201);
    expect(result.body.model).toBe('OpenAI GPT');
    expect(result.body.result).toBe('[OpenAI] 已处理你的请求：Hello');
  });

  it('覆盖配置后工厂选择 Anthropic Mock', async () => {
    const fixture = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(AI_CONFIG)
      .useValue({ provider: 'anthropic', maxTokens: 1000, temperature: 0.7 })
      .compile();
    const alternative = fixture.createNestApplication();
    await alternative.init();
    try {
      const result = await request(alternative.getHttpServer())
        .post('/ai/generate')
        .send({ prompt: 'Hello' })
        .expect(201);
      expect(result.body.model).toBe('Anthropic Claude');
      expect(result.body.result).toBe('[Anthropic] 已处理你的请求：Hello');
    } finally {
      await alternative.close();
    }
  });

  it('无效 Prompt 返回 400', async () => {
    for (const prompt of ['', '   ', 123, 'a'.repeat(2001)]) {
      await request(app.getHttpServer())
        .post('/ai/generate')
        .send({ prompt })
        .expect(400);
    }
    await request(app.getHttpServer())
      .post('/ai/generate')
      .send({})
      .expect(400);
  });

  it('useExisting 的日志 Token 与类 Token 引用同一实例', async () => {
    const response = await request(app.getHttpServer())
      .get('/ai/logger')
      .expect(200);
    expect(response.body.sameInstance).toBe(true);
    expect(response.body.aliasInstanceId).toBe(response.body.classInstanceId);
  });

  afterEach(async () => {
    await app?.close();
  });
});
