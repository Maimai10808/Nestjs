import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('ExecutionContext 与角色元数据', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const fixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = fixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => { await app.close(); });

  it('没有有效身份时返回 401，客户端角色头不能授予权限', async () => {
    await request(app.getHttpServer()).get('/agents').expect(401);
    await request(app.getHttpServer()).delete('/agents/1')
      .set('x-role', 'admin').expect(401);
    await request(app.getHttpServer()).get('/agents')
      .set('Authorization', 'Bearer invalid').expect(401);
  });

  it('类级元数据允许 user/admin 读取，方法级元数据只允许 admin 删除', async () => {
    await request(app.getHttpServer()).get('/agents')
      .set('Authorization', 'Bearer demo-user-token').expect(200);
    await request(app.getHttpServer()).delete('/agents/1')
      .set('Authorization', 'Bearer demo-user-token').set('x-role', 'admin').expect(403);
    await request(app.getHttpServer()).get('/agents')
      .set('Authorization', 'Bearer demo-admin-token').expect(200);
    const removed = await request(app.getHttpServer()).delete('/agents/1')
      .set('Authorization', 'Bearer demo-admin-token').expect(200);
    expect(removed.body).toMatchObject({ id: 1, name: 'Research Agent' });
  });

  it('创建时验证名称，非法请求不添加脏数据', async () => {
    await request(app.getHttpServer()).post('/agents')
      .set('Authorization', 'Bearer demo-user-token').send({ name: '   ' }).expect(400);
    const created = await request(app.getHttpServer()).post('/agents')
      .set('Authorization', 'Bearer demo-user-token').send({ name: '  Tutor  ' }).expect(201);
    expect(created.body).toMatchObject({ name: 'Tutor' });
  });
});
