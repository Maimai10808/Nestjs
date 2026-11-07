import { NestFactory } from '@nestjs/core';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('deployable research API', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const { AppModule } = await import('../dist/app.module.js');
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    await app.listen(0, '127.0.0.1');
  });
  afterAll(async () => { await app?.close(); });

  it('provides a real health response and validates inputs', async () => {
    const health = await request(app.getHttpServer()).get('/health').expect(200);
    expect(health.body).toMatchObject({ status: 'ok', info: { memory_heap: { status: 'up' } } });
    await request(app.getHttpServer()).post('/research').send({ topic: 'x', model: 'invalid' }).expect(400);
    await request(app.getHttpServer()).get('/research/missing').expect(404);
  });

  it('creates and completes an in-memory mock research task', async () => {
    const created = await request(app.getHttpServer()).post('/research')
      .send({ topic: 'NestJS deployment lifecycle', model: 'gpt-4.1' }).expect(201);
    expect(created.body).toMatchObject({ topic: 'NestJS deployment lifecycle', status: 'running' });
    await vi.waitFor(async () => {
      const response = await request(app.getHttpServer()).get(`/research/${String(created.body.id)}`).expect(200);
      expect(response.body).toMatchObject({ status: 'completed', progress: 100 });
      expect(response.body.result).toContain('模拟完成');
    }, { timeout: 7000, interval: 200 });
    const listed = await request(app.getHttpServer()).get('/research').expect(200);
    expect(listed.body).toHaveLength(1);
  }, 10000);
});
