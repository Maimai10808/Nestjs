import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
const valid = { name: 'Research Agent', model: 'gpt-4.1', temperature: 0.7, maxSteps: 10, tools: ['web_search'] };

describe('validation through actual module configuration', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication(); await app.init();
  });
  afterEach(async () => { await app.close(); });
  it('rejects invalid and unknown fields before writing state', async () => {
    await request(app.getHttpServer()).post('/agents').send({ ...valid, maxSteps: 0 }).expect(400);
    await request(app.getHttpServer()).post('/agents').send({ ...valid, id: 99 }).expect(400);
    const created = await request(app.getHttpServer()).post('/agents').send(valid).expect(201);
    expect(created.body.id).toBe(1);
  });
  it('transforms query numbers and exact boolean strings', async () => {
    await request(app.getHttpServer()).post('/agents').send({ ...valid, enabled: false }).expect(201);
    const list = await request(app.getHttpServer()).get('/agents?page=1&pageSize=1&enabled=false').expect(200);
    expect(list.body.pagination).toMatchObject({ page: 1, pageSize: 1, total: 1 });
    await request(app.getHttpServer()).get('/agents?enabled=no').expect(400);
    await request(app.getHttpServer()).get('/agents?page=0').expect(400);
  });
  it('validates partial updates and nested option objects', async () => {
    const created = await request(app.getHttpServer()).post('/agents').send(valid).expect(201);
    await request(app.getHttpServer()).patch(`/agents/${created.body.id}`).send({ name: null }).expect(400);
    await request(app.getHttpServer()).patch(`/agents/${created.body.id}`).send({ enabled: null }).expect(400);
    await request(app.getHttpServer()).post(`/agents/${created.body.id}/run`).send({ input: 'Explain DTO', options: [] }).expect(400);
    await request(app.getHttpServer()).post(`/agents/${created.body.id}/run`).send({ input: 'Explain DTO', options: { maxTokens: 0 } }).expect(400);
    const result = await request(app.getHttpServer()).post(`/agents/${created.body.id}/run`).send({ input: 'Explain DTO', options: { maxTokens: 32 } }).expect(200);
    expect(result.body.options.maxTokens).toBe(32);
  });
  it('validates the whole bulk input and parses id arrays', async () => {
    await request(app.getHttpServer()).post('/agents/bulk').send([valid, { ...valid, name: 'x' }]).expect(400);
    const created = await request(app.getHttpServer()).post('/agents/bulk').send([valid, { ...valid, name: 'Coding Agent' }]).expect(201);
    expect(created.body.map((x: { id: number }) => x.id)).toEqual([1, 2]);
    const found = await request(app.getHttpServer()).get('/agents/search/by-ids?ids=1,2').expect(200);
    expect(found.body).toHaveLength(2);
    await request(app.getHttpServer()).get('/agents/search/by-ids?ids=nope').expect(400);
  });
});
