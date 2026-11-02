import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('自定义装饰器：用户上下文与资源归属', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const fixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = fixture.createNestApplication();
    await app.init();
  });

  it('公开标记让绑定的认证 Guard 放行，受保护路由拒绝无效和原型属性 Token', async () => {
    const publicAgents = await request(app.getHttpServer())
      .get('/agents/public')
      .expect(200);
    expect(
      publicAgents.body.every((agent: { isPublic: boolean }) => agent.isPublic),
    ).toBe(true);
    for (const token of ['fake', 'constructor', 'toString', '__proto__']) {
      await request(app.getHttpServer())
        .get('/agents/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    }
    await request(app.getHttpServer()).get('/agents/me').expect(401);
  });

  it('CurrentUser 读取服务端验证的用户与字符串 ID', async () => {
    const me = await request(app.getHttpServer())
      .get('/agents/me')
      .set('Authorization', 'Bearer user-token')
      .expect(200);
    expect(me.body.user.id).toBe('user_002');
    const id = await request(app.getHttpServer())
      .get('/agents/my-id')
      .set('Authorization', 'Bearer user-token')
      .expect(200);
    expect(id.body.userId).toBe('user_002');
  });

  it('用户只能查询和修改自己的 Agent，不能注入 ownerId', async () => {
    await request(app.getHttpServer())
      .get('/agents/2')
      .set('Authorization', 'Bearer user-token')
      .expect(404);
    await request(app.getHttpServer())
      .patch('/agents/2')
      .set('Authorization', 'Bearer user-token')
      .send({ name: 'stolen' })
      .expect(404);
    await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', 'Bearer user-token')
      .send({
        name: 'New',
        description: '',
        isPublic: false,
        ownerId: 'user_001',
      })
      .expect(400);
    const created = await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', 'Bearer user-token')
      .send({ name: 'New', description: '', isPublic: false })
      .expect(201);
    expect(created.body.ownerId).toBe('user_002');
    const updated = await request(app.getHttpServer())
      .patch(`/agents/${created.body.id}`)
      .set('Authorization', 'Bearer user-token')
      .send({ name: 'Renamed' })
      .expect(200);
    expect(updated.body.name).toBe('Renamed');
    await request(app.getHttpServer())
      .patch(`/agents/${created.body.id}`)
      .set('Authorization', 'Bearer user-token')
      .send({ isPublic: 'false' })
      .expect(400);
  });

  it('Roles 与 Auth 组合装饰器拒绝普通用户并允许管理员', async () => {
    await request(app.getHttpServer())
      .get('/agents/admin/all')
      .set('Authorization', 'Bearer user-token')
      .expect(403);
    await request(app.getHttpServer())
      .delete('/agents/admin/1')
      .set('Authorization', 'Bearer user-token')
      .expect(403);
    await request(app.getHttpServer())
      .get('/agents/admin/all')
      .set('Authorization', 'Bearer admin-token')
      .expect(200);
    await request(app.getHttpServer())
      .delete('/agents/admin/1')
      .set('Authorization', 'Bearer admin-token')
      .expect(200);
  });

  afterEach(async () => {
    await app?.close();
  });
});
