import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { AiModule } from '../dist/ai/ai.module.js';
import type { AiModuleOptions } from '../src/ai/interfaces/ai-options.interface.js';

describe('Dynamic AI module', () => {
  let app: INestApplication;

  afterEach(async () => {
    await app?.close();
  });

  async function createApp(provider?: AiModuleOptions['provider']) {
    const imports = provider
      ? [AiModule.register({ provider, timeout: 1000, maxRetries: 0 })]
      : [AppModule];
    const module = await Test.createTestingModule({ imports }).compile();
    app = module.createNestApplication();
    await app.init();
  }

  it('uses the OpenAI registration from the real application', async () => {
    await createApp();
    await request(app.getHttpServer())
      .get('/ai/config')
      .expect(200, { model: 'OpenAI', timeout: 30000, maxRetries: 3 });
    const response = await request(app.getHttpServer())
      .post('/ai/generate')
      .send({ prompt: '你好' })
      .expect(201);
    expect(response.body.provider).toBe('OpenAI');
    expect(response.body.result).toBe('[OpenAI 模拟响应] 你好');
  });

  it('changes the implementation when another module configuration is used', async () => {
    await createApp('claude');
    const response = await request(app.getHttpServer())
      .post('/ai/generate')
      .send({ prompt: '你好' })
      .expect(201);
    expect(response.body.provider).toBe('Claude');
    expect(response.body.result).toBe('[Claude 模拟响应] 你好');
    expect(response.body.config).toEqual({ model: 'Claude', timeout: 1000, maxRetries: 0 });
  });

  it('rejects non-string and empty prompts', async () => {
    await createApp();
    for (const prompt of [undefined, '', '   ', 42, {}]) {
      await request(app.getHttpServer())
        .post('/ai/generate')
        .send({ prompt })
        .expect(400);
    }
  });
});
