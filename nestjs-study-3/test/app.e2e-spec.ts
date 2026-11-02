import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('中间件与异常过滤器 (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => { await app.close(); });
  it('商品请求添加request id；仅写入需要演示API Key', async () => {
    await request(app.getHttpServer()).get('/products').expect(200).expect('X-Request-ID', /.+/);
    await request(app.getHttpServer()).post('/products').send({ name: 'Keyboard', price: 100 }).expect(401);
    await request(app.getHttpServer()).post('/products').set('X-API-Key', 'study-secret-key').expect(400);
    const created = await request(app.getHttpServer()).post('/products').set('X-API-Key', 'study-secret-key').send({ name: 'Keyboard', price: 100 }).expect(201);
    expect(created.body).toMatchObject({ name: 'Keyboard', price: 100, stock: 0 });
    await request(app.getHttpServer()).post('/products').set('X-API-Key', 'study-secret-key').send({ name: 7, price: -1 }).expect(400);
  });
  it('标准、自定义、未知异常被实际注册的过滤器处理', async () => {
    const missing = await request(app.getHttpServer()).get('/exception-lab/agents/99').expect(404);
    expect(missing.body).toMatchObject({ statusCode: 404, path: '/exception-lab/agents/99' });
    const quota = await request(app.getHttpServer()).get('/exception-lab/quota').expect(429);
    expect(quota.body.message).toMatchObject({ errorCode: 'AGENT_QUOTA_EXCEEDED', limit: 100, used: 150 });
    const filtered = await request(app.getHttpServer()).get('/exception-lab/filtered').expect(400);
    expect(filtered.body.message).toBe('这是由自定义过滤器处理的异常');
    const crash = await request(app.getHttpServer()).get('/exception-lab/crash').expect(500);
    expect(crash.body.message).toBe('Internal server error');
    expect(JSON.stringify(crash.body)).not.toContain('数据库');
  });
  it('非法Agent名称返回400；重复名称409；模型故障503', async () => {
    await request(app.getHttpServer()).post('/exception-lab/agents').send({ name: 7 }).expect(400);
    await request(app.getHttpServer()).post('/exception-lab/agents').send({ name: 'Research Agent' }).expect(409);
    await request(app.getHttpServer()).get('/exception-lab/llm-error').expect(503);
  });
});
