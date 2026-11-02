import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('Guard：认证与角色授权', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const fixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = fixture.createNestApplication();
    await app.init();
  });

  it('公开路由允许匿名访问，受保护路由拒绝缺失或伪造 Token', async () => {
    await request(app.getHttpServer()).get('/agents/public').expect(200);
    await request(app.getHttpServer()).get('/agents').expect(401);
    await request(app.getHttpServer())
      .get('/agents')
      .set('Authorization', 'Bearer fake')
      .expect(401);
    await request(app.getHttpServer())
      .get('/agents')
      .set('Authorization', 'Bearer demo-viewer extra')
      .expect(401);
  });

  it('viewer 可读不能创建，developer 可创建不能删除，admin 可删除', async () => {
    await request(app.getHttpServer())
      .get('/agents')
      .set('Authorization', 'Bearer demo-viewer')
      .expect(200);
    await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', 'Bearer demo-viewer')
      .expect(403);
    const created = await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', 'Bearer demo-developer')
      .expect(201);
    await request(app.getHttpServer())
      .delete(`/agents/${created.body.id}`)
      .set('Authorization', 'Bearer demo-developer')
      .expect(403);
    await request(app.getHttpServer())
      .delete(`/agents/${created.body.id}`)
      .set('Authorization', 'Bearer demo-admin')
      .expect(200);
  });

  it('删除中间记录后创建的 ID 不与现存 Agent 冲突', async () => {
    await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', 'Bearer demo-admin')
      .expect(201);
    await request(app.getHttpServer())
      .delete('/agents/1')
      .set('Authorization', 'Bearer demo-admin')
      .expect(200);
    const created = await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', 'Bearer demo-admin')
      .expect(201);
    expect(created.body.id).toBe('4');
    await request(app.getHttpServer())
      .get('/agents/3')
      .set('Authorization', 'Bearer demo-admin')
      .expect(200);
  });

  afterEach(async () => {
    await app?.close();
  });
});
