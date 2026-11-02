import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('商品参数管道 (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => { await app.close(); });
  it('DTO拒绝未知字段与不合法类型，合法商品成功保存', async () => {
    const dto = { name: 'Keyboard', price: 100, stock: 2, status: 'active' };
    await request(app.getHttpServer()).post('/products').send({ ...dto, id: 99 }).expect(400);
    await request(app.getHttpServer()).post('/products').send({ ...dto, price: '100' }).expect(400);
    const product = await request(app.getHttpServer()).post('/products').send(dto).expect(201);
    expect(product.body).toMatchObject({ ...dto, id: 3 });
    await request(app.getHttpServer()).get('/products/detail/3').expect(200);
  });
  it('内置管道转换query，非法枚举与布尔值400', async () => {
    const pagination = await request(app.getHttpServer()).get('/products/pagination').expect(200);
    expect(pagination.body).toMatchObject({ page: 1, limit: 10 });
    const bool = await request(app.getHttpServer()).get('/products/filter/active?active=false').expect(200);
    expect(bool.body).toMatchObject({ active: false, type: 'boolean' });
    await request(app.getHttpServer()).get('/products/filter/active?active=no').expect(400);
    await request(app.getHttpServer()).get('/products/filter/status?status=deleted').expect(400);
  });
  it('自定义PositiveIntPipe被路由实际调用', async () => {
    await request(app.getHttpServer()).get('/products/positive/1').expect(200);
    await request(app.getHttpServer()).get('/products/positive/0').expect(400);
    await request(app.getHttpServer()).get('/products/positive/1.5').expect(400);
  });
});
