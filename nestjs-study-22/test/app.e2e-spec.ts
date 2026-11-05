import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('automatic and manual memory cache', () => {
  let app: INestApplication;
  let cache: Cache;
  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication(); await app.init(); cache = app.get(CACHE_MANAGER);
  });
  afterEach(async () => { await app.close(); });
  it('stores model results under the documented manual key and uses millisecond TTL', async () => {
    const models = await request(app.getHttpServer()).get('/models').expect(200);
    expect(await cache.get('ai:models:all')).toEqual(models.body);
    await cache.set('probe', 'alive', 30);
    expect(await cache.get('probe')).toBe('alive');
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(await cache.get('probe')).toBeUndefined();
  });
  it('keeps automatic GET snapshots until invalidation or expiration', async () => {
    const before = await request(app.getHttpServer()).get('/agents').expect(200);
    expect(before.body).toHaveLength(2);
    await request(app.getHttpServer()).post('/agents').send({ name: 'New Agent', description: 'Demo', model: 'mock' }).expect(201);
    expect((await request(app.getHttpServer()).get('/agents').expect(200)).body).toEqual(before.body);
    await cache.del('/agents');
    expect((await request(app.getHttpServer()).get('/agents').expect(200)).body).toHaveLength(3);
  });
  it('rejects body fields that could overwrite server state', async () => {
    await request(app.getHttpServer()).post('/agents').send({ name: 4, description: 'Demo', model: 'mock' }).expect(400);
    await request(app.getHttpServer()).patch('/agents/1').send({ id: 99, enabled: false }).expect(400);
    const original = await request(app.getHttpServer()).get('/agents/1').expect(200);
    expect(original.body.id).toBe(1); expect(original.body.enabled).toBe(true);
    await request(app.getHttpServer()).patch('/agents/1').send({ name: 'Renamed' }).expect(200);
  });
});
