import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('DiscoveryService 工具注册表', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const fixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = fixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => { await app.close(); });

  it('发现三个已注册工具并执行计算与 Mock 工具', async () => {
    const tools = await request(app.getHttpServer()).get('/agent/tools').expect(200);
    expect(tools.body.map((tool: { name: string }) => tool.name).sort())
      .toEqual(['calculator', 'search', 'weather']);
    const calculation = await request(app.getHttpServer()).post('/agent/tools/calculator/execute')
      .send({ input: '10 20' }).expect(201);
    expect(calculation.body.result.result).toBe(30);
    const weather = await request(app.getHttpServer()).post('/agent/tools/weather/execute')
      .send({ input: '北京' }).expect(201);
    expect(weather.body.result).toMatchObject({ city: '北京', mock: true });
    const search = await request(app.getHttpServer()).post('/agent/tools/search/execute')
      .send({ input: 'NestJS' }).expect(201);
    expect(search.body.result).toMatchObject({ query: 'NestJS', mock: true });
  });

  it('拒绝不存在的工具、缺失或空白输入及非法运算', async () => {
    await request(app.getHttpServer()).post('/agent/tools/missing/execute')
      .send({ input: 'hello' }).expect(404);
    for (const input of [undefined, 42, '  ']) {
      await request(app.getHttpServer()).post('/agent/tools/calculator/execute')
        .send({ input }).expect(400);
    }
    await request(app.getHttpServer()).post('/agent/tools/calculator/execute')
      .send({ input: '1 nope' }).expect(400);
    await request(app.getHttpServer()).post('/agent/tools/calculator/execute')
      .send({ input: '1e308 1e308' }).expect(400);
  });
});
