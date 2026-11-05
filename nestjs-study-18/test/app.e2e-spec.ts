import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('typed configuration and quota rules', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication(); await app.init();
  });
  afterEach(async () => { await app?.close(); });
  it('injects namespaced numeric config and validates prompts', async () => {
    const config = await request(app.getHttpServer()).get('/agents/config').expect(200);
    expect(config.body.maxSteps).toBeTypeOf('number');
    const result = await request(app.getHttpServer()).post('/agents/run').send({ prompt: 'Explain config' }).expect(201);
    expect(result.body.execution.maxSteps).toBe(config.body.maxSteps);
    await request(app.getHttpServer()).post('/agents/run').send({ prompt: 4 }).expect(400);
  });
  it('does not allow negative usage to increase a quota', async () => {
    const config = await request(app.getHttpServer()).get('/quota/config').expect(200);
    const used = await request(app.getHttpServer()).get('/quota/check?usedToday=1').expect(200);
    expect(used.body.remaining).toBe(config.body.dailyLimit - 1);
    await request(app.getHttpServer()).get('/quota/check?usedToday=-1').expect(400);
    await request(app.getHttpServer()).get('/quota/check?usedToday=not-a-number').expect(400);
  });
});
