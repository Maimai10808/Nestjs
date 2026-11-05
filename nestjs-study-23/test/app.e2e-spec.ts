import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager';

describe('分组缓存和写后失效', () => {
  let app: INestApplication;
  let cache: Cache;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    cache = app.get<Cache>(CACHE_MANAGER);
  });
  afterEach(async () => {
    await app.close();
  });
  it('按用户隔离缓存，修改后同步失效公开列表、详情和所属用户', async () => {
    await request(app.getHttpServer()).get('/agents').expect(200);
    await request(app.getHttpServer()).get('/agents/1').expect(200);
    const mine = await request(app.getHttpServer())
      .get('/users/me/agents')
      .set('x-demo-user-id', '1001')
      .expect(200);
    expect(mine.body).toHaveLength(1);
    const other = await request(app.getHttpServer())
      .get('/users/me/agents')
      .set('x-demo-user-id', '1002')
      .expect(200);
    expect(other.body[0].id).toBe(2);
    expect(await cache.get('agents:detail:1')).toBeDefined();
    await request(app.getHttpServer())
      .patch('/agents/1')
      .send({ name: 'Updated Research' })
      .expect(200);
    expect(await cache.get('agents:public:list')).toBeUndefined();
    expect(await cache.get('agents:detail:1')).toBeUndefined();
    expect(await cache.get('users:1001:agents')).toBeUndefined();
    expect(await cache.get('users:1002:agents')).toBeDefined();
    const fresh = await request(app.getHttpServer())
      .get('/agents/1')
      .expect(200);
    expect(fresh.body.name).toBe('Updated Research');
  });
  it('拒绝修改服务端标识和错误字段类型，避免失效错误缓存', async () => {
    await request(app.getHttpServer())
      .patch('/agents/1')
      .send({ id: 2, userId: 1002 })
      .expect(400);
    await request(app.getHttpServer())
      .patch('/agents/1')
      .send({ enabled: 'false' })
      .expect(400);
    await request(app.getHttpServer())
      .patch('/agents/1')
      .send({ name: null })
      .expect(400);
    const original = await request(app.getHttpServer())
      .get('/agents/1')
      .expect(200);
    expect(original.body.userId).toBe(1001);
  });
  it('验证 header，手动清除缓存和读取模型目录', async () => {
    await request(app.getHttpServer()).get('/users/me/agents').expect(400);
    await request(app.getHttpServer())
      .get('/users/me/agents')
      .set('x-demo-user-id', 'abc')
      .expect(400);
    await request(app.getHttpServer()).get('/agents').expect(200);
    await request(app.getHttpServer()).delete('/cache/agents').expect(200);
    expect(await cache.get('agents:public:list')).toBeUndefined();
    await request(app.getHttpServer()).get('/agents/1').expect(200);
    await request(app.getHttpServer()).delete('/cache/agents/1').expect(200);
    expect(await cache.get('agents:detail:1')).toBeUndefined();
    const models = await request(app.getHttpServer())
      .get('/models')
      .expect(200);
    expect(await cache.get('models:catalog')).toEqual(models.body);
    await request(app.getHttpServer()).delete('/agents/1').expect(200);
    await request(app.getHttpServer()).get('/agents/1').expect(404);
  });
});
