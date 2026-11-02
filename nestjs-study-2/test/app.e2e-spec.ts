import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('电商模块协作 (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => { await app.close(); });
  it('通过模块导出的商品服务与支付服务创建订单', async () => {
    const products = await request(app.getHttpServer()).get('/products').expect(200);
    expect(products.body).toHaveLength(3);
    const order = await request(app.getHttpServer()).post('/orders').send({ productId: 1, quantity: 2 }).expect(201);
    expect(order.body).toMatchObject({ product: { id: 1 }, quantity: 2, totalAmount: 30000, payment: { amount: 30000, status: 'PENDING' } });
    expect(order.body.orderId).toBeTypeOf('string');
  });
  it('拒绝无效商品、非法ID和非正整数数量', async () => {
    await request(app.getHttpServer()).get('/products/nope').expect(400);
    await request(app.getHttpServer()).post('/orders').send({ productId: 999, quantity: 1 }).expect(404);
    for (const quantity of [0, -1, 1.5]) {
      await request(app.getHttpServer()).post('/orders').send({ productId: 1, quantity }).expect(400);
    }
  });
});
