import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('用户控制器与 Provider 实验 (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => { await app.close(); });
  it('应用默认分页并转换 query；拒绝越界分页', async () => {
    const list = await request(app.getHttpServer()).get('/users').expect(200);
    expect(list.body).toMatchObject({ total: 2, page: 1, limit: 10 });
    expect(list.body.data).toHaveLength(2);
    const filtered = await request(app.getHttpServer()).get('/users?page=1&limit=1&name=Robin').expect(200);
    expect(filtered.body.data[0].name).toBe('Robin');
    await request(app.getHttpServer()).get('/users?page=0').expect(400);
  });
  it('验证 DTO、保护服务端字段，并区分 PATCH 与 PUT', async () => {
    await request(app.getHttpServer()).post('/users').send({ name: 'A', email: 'bad' }).expect(400);
    await request(app.getHttpServer()).post('/users').send({ name: 'Bob', email: 'bob@example.com', id: 90 }).expect(400);
    const created = await request(app.getHttpServer()).post('/users').send({ name: 'Bob', email: 'bob@example.com', city: 'Beijing' }).expect(201);
    const id: number = created.body.id;
    await request(app.getHttpServer()).patch(`/users/${id}`).send({ name: null }).expect(400);
    const patched = await request(app.getHttpServer()).patch(`/users/${id}`).send({ name: 'Bobby' }).expect(200);
    expect(patched.body.city).toBe('Beijing');
    const replaced = await request(app.getHttpServer()).put(`/users/${id}`).send({ name: 'Robert', email: 'robert@example.com' }).expect(200);
    expect(replaced.body.city).toBeUndefined();
    await request(app.getHttpServer()).delete(`/users/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/users/${id}`).expect(404);
  });
  it('可观察默认和请求作用域，以及可选依赖', async () => {
    const a = await request(app.getHttpServer()).get('/provider-lab/scope').expect(200);
    const b = await request(app.getHttpServer()).get('/provider-lab/scope').expect(200);
    expect(a.body.singleton.instanceId).toBe(b.body.singleton.instanceId);
    expect(a.body.request.instanceId).not.toBe(b.body.request.instanceId);
    const optional = await request(app.getHttpServer()).get('/provider-lab/optional').expect(200);
    expect(optional.body).toMatchObject({ emailEnabled: false, emailResult: null });
  });
  it('跨模块下单并扣库存，非法金额和数量被拒绝', async () => {
    await request(app.getHttpServer()).post('/payments').send({}).expect(400);
    await request(app.getHttpServer()).post('/orders').send({ productId: 1, quantity: -1 }).expect(400);
    const order = await request(app.getHttpServer()).post('/orders').send({ productId: 1, quantity: 2 }).expect(201);
    expect(order.body).toMatchObject({ quantity: 2, totalPrice: 29998, status: 'paid' });
    const product = await request(app.getHttpServer()).get('/products/1').expect(200);
    expect(product.body.stock).toBe(8);
  });
  it('不回显凭证，保留响应头与重定向示例', async () => {
    const headers = await request(app.getHttpServer()).get('/users/request-headers').set('Authorization', 'Bearer secret').expect(200);
    expect(JSON.stringify(headers.body)).not.toContain('Bearer secret');
    const info = await request(app.getHttpServer()).get('/users/request-info').set('Cookie', 'session=secret').expect(200);
    expect(JSON.stringify(info.body)).not.toContain('session=secret');
    await request(app.getHttpServer()).get('/users/custom-header').expect('X-App-Name', 'NestJS-Study');
    await request(app.getHttpServer()).get('/users/docs').expect(302).expect('Location', 'https://docs.nestjs.com');
  });
});
