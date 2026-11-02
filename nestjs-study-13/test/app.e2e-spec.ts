import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { LazyModuleLoader, ModulesContainer } from '@nestjs/core';
import { ResearchModule } from '../dist/research/research.module.js';
import { CodingModule } from '../dist/coding/coding.module.js';
import { AppModule } from '../dist/app.module.js';
import { ResearchService } from '../dist/research/research.service.js';
import { CodingService } from '../dist/coding/coding.service.js';

describe('按需加载 Agent 模块', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const fixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = fixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => { await app.close(); });

  it('启动时不创建研究和代码 Provider，首次请求加载后复用研究实例', async () => {
    const modules = app.get(ModulesContainer);
    expect([...modules.values()].some((module) => module.metatype === ResearchModule)).toBe(false);
    expect([...modules.values()].some((module) => module.metatype === CodingModule)).toBe(false);
    await request(app.getHttpServer()).post('/agents/run')
      .send({ type: 'chat', prompt: '你好' }).expect(201)
      .expect({ type: 'chat', result: '普通聊天结果：你好' });
    expect([...modules.values()].some((module) => module.metatype === ResearchModule)).toBe(false);

    await request(app.getHttpServer()).post('/agents/run')
      .send({ type: 'research', prompt: 'NestJS' }).expect(201)
      .expect({ type: 'research', result: '深度研究完成：NestJS' });
    expect([...modules.values()].some((module) => module.metatype === ResearchModule)).toBe(true);
    const loader = app.get(LazyModuleLoader);
    const researchRef = await loader.load(() => ResearchModule);
    const instance = researchRef.get(ResearchService);
    await request(app.getHttpServer()).post('/agents/run')
      .send({ type: 'research', prompt: 'TypeScript' }).expect(201);
    const cachedRef = await loader.load(() => ResearchModule);
    expect(cachedRef.get(ResearchService)).toBe(instance);
    expect([...modules.values()].some((module) => module.metatype === CodingModule)).toBe(false);

    await request(app.getHttpServer()).post('/agents/run')
      .send({ type: 'coding', prompt: '加法函数' }).expect(201)
      .expect({ type: 'coding', result: '代码任务完成：加法函数' });
    expect([...modules.values()].some((module) => module.metatype === CodingModule)).toBe(true);
    const codingRef = await loader.load(() => CodingModule);
    expect(codingRef.get(CodingService)).toBeDefined();
  }, 10000);

  it('拒绝未知类型和空 prompt', async () => {
    await request(app.getHttpServer()).post('/agents/run')
      .send({ type: 'unknown', prompt: 'hello' }).expect(400);
    await request(app.getHttpServer()).post('/agents/run')
      .send({ type: 'chat', prompt: '  ' }).expect(400);
  });
});
