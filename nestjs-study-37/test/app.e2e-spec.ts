import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../dist/app.module.js';

describe('Real Fastify adapter', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });
  afterAll(async () => {
    await app?.close();
  });
  it('serves feature modules, native request/reply, and platform info', async () => {
    expect(
      (await app.inject({ method: 'GET', url: '/agents' })).json(),
    ).toHaveLength(3);
    expect(
      (await app.inject({ method: 'GET', url: '/models' })).json(),
    ).toHaveLength(3);
    expect(
      (await app.inject({ method: 'GET', url: '/performance/info' })).json()
        .adapter,
    ).toBe('fastify');
    expect(
      (await app.inject({ method: 'GET', url: '/performance/large' })).json()
        .agents,
    ).toHaveLength(1000);
    const reply = await app.inject({
      method: 'GET',
      url: '/performance/reply',
    });
    expect(reply.headers['x-ai-platform']).toBe('Fastify');
    const req = await app.inject({
      method: 'GET',
      url: '/performance/request',
      headers: { 'user-agent': 'study-test' },
    });
    expect(req.json()).toEqual({
      method: 'GET',
      url: '/performance/request',
      userAgent: 'study-test',
    });
  });
  it('runs validated mock research and handles invalid IDs', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/agents/research',
      payload: { topic: 'LangGraph' },
    });
    expect(result.statusCode).toBe(201);
    expect(result.json().topic).toBe('LangGraph');
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/agents/research',
          payload: { topic: 'x' },
        })
      ).statusCode,
    ).toBe(400);
    expect(
      (await app.inject({ method: 'GET', url: '/agents/abc' })).statusCode,
    ).toBe(400);
    expect(
      (await app.inject({ method: 'GET', url: '/agents/999' })).statusCode,
    ).toBe(404);
  });
});
