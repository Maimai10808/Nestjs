import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('HTTP 序列化', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  it('实体、plain 指定实体和公开路由都转换响应', async () => {
    for (const path of ['/agents/1', '/agents/1/plain', '/agents/1/public']) {
      const response = await request(app.getHttpServer()).get(path).expect(200);
      expect(response.body.model).toBe('gpt-4.1');
      expect(response.body.status).toBe('available');
      expect(response.body).not.toHaveProperty('apiKey');
      expect(response.body).not.toHaveProperty('systemPrompt');
      expect(response.body).not.toHaveProperty('totalCost');
    }
    const list = await request(app.getHttpServer()).get('/agents').expect(200);
    expect(list.body[2].status).toBe('disabled');
  });
  it('raw 对照确实保留假秘密；用户层级拦截器隐藏秘密并暴露 getter', async () => {
    const raw = await request(app.getHttpServer())
      .get('/agents/1/raw')
      .expect(200);
    expect(raw.body.apiKey).toBe('sk-example-agent-secret');
    expect(raw.body.model.name).toBe('gpt-4.1');
    for (const path of ['/users/1001', '/users/1001/profile']) {
      const user = await request(app.getHttpServer()).get(path).expect(200);
      expect(user.body.fullName).toBe('Robin Mai');
      expect(user.body).not.toHaveProperty('passwordHash');
      expect(user.body).not.toHaveProperty('apiKey');
    }
    await request(app.getHttpServer()).get('/agents/999').expect(404);
    await request(app.getHttpServer()).get('/users/nope').expect(400);
  });
});
