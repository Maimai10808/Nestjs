import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('Interceptor：响应、缓存与异常', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const fixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = fixture.createNestApplication();
    await app.init();
  });

  it('统一响应包装列表，HTTP 异常保持 404', async () => {
    const response = await request(app.getHttpServer())
      .get('/agents')
      .expect(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(3);
    await request(app.getHttpServer()).get('/agents/999').expect(404);
  });

  it('DTO 验证拒绝未知字段与无效状态，合法创建不能覆盖 ID', async () => {
    const dto = {
      name: 'Test Agent',
      description: '测试',
      model: 'mock',
      status: 'active',
    };
    await request(app.getHttpServer())
      .post('/agents')
      .send({ ...dto, id: 999 })
      .expect(400);
    await request(app.getHttpServer())
      .post('/agents')
      .send({ ...dto, status: 'broken' })
      .expect(400);
    const response = await request(app.getHttpServer())
      .post('/agents')
      .send(dto)
      .expect(201);
    expect(response.body.data.id).toBe(4);
  });

  it('缓存短路后续 Service 调用，保存首次列表快照', async () => {
    const first = await request(app.getHttpServer())
      .get('/agents/cached')
      .expect(200);
    await request(app.getHttpServer())
      .post('/agents')
      .send({ name: 'Added', description: '', model: 'mock', status: 'active' })
      .expect(201);
    const second = await request(app.getHttpServer())
      .get('/agents/cached')
      .expect(200);
    expect(second.body).toEqual(first.body);
    const fresh = await request(app.getHttpServer()).get('/agents').expect(200);
    expect(fresh.body.data).toHaveLength(4);
  });

  it('未知下游异常映射为 502', async () => {
    await request(app.getHttpServer()).get('/agents/error').expect(502);
  });

  it('慢请求超过 5 秒返回 408', async () => {
    await request(app.getHttpServer()).get('/agents/slow').expect(408);
  }, 10000);

  afterEach(async () => {
    await app?.close();
  });
});
