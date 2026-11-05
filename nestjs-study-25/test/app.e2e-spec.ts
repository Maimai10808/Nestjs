import { Test } from '@nestjs/testing';
import {
  ValidationPipe,
  VersioningType,
  type INestApplication,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('URI 版本和异步论文', () => {
  let app: INestApplication;
  const config = {
    paperType: 'research',
    wordCount: 1000,
    citationStyle: 'APA',
    model: 'gpt-4.1',
  };
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  it('同路径按版本返回不同目录，无版本 health 保持独立', async () => {
    const v1 = await request(app.getHttpServer())
      .get('/v1/papers/models')
      .expect(200);
    const v2 = await request(app.getHttpServer())
      .get('/v2/papers/models')
      .expect(200);
    expect(v1.body[0]).toBe('gpt-4.1');
    expect(v2.body[0].provider).toBe('openai');
    const first = await request(app.getHttpServer())
      .get('/v1/papers/templates')
      .expect(200);
    const second = await request(app.getHttpServer())
      .get('/v2/papers/templates')
      .expect(200);
    expect(first.body).toEqual(second.body);
    await request(app.getHttpServer()).get('/health').expect(200);
    await request(app.getHttpServer()).get('/papers/models').expect(404);
  });
  it('V1 同步返回内容；V2 创建、轮询完成', async () => {
    const sync = await request(app.getHttpServer())
      .post('/v1/papers/generate')
      .send({ topic: 'Agent 研究' })
      .expect(201);
    expect(sync.body.content).toContain('Agent 研究');
    const create = await request(app.getHttpServer())
      .post('/v2/papers/generate')
      .send({ topic: 'Agent 研究', config })
      .expect(201);
    const pending = await request(app.getHttpServer())
      .get(`/v2/papers/tasks/${create.body.taskId}`)
      .expect(200);
    expect(pending.body.status).toBe('pending');
    await new Promise((resolve) => setTimeout(resolve, 3100));
    const done = await request(app.getHttpServer())
      .get(`/v2/papers/tasks/${create.body.taskId}`)
      .expect(200);
    expect(done.body.status).toBe('completed');
    expect(done.body.result).toContain('1000');
  });
  it('嵌套 config 必须是对象而非数组，非法版本和任务返回 404', async () => {
    await request(app.getHttpServer())
      .post('/v2/papers/generate')
      .send({ topic: 'test', config: [config] })
      .expect(400);
    await request(app.getHttpServer())
      .post('/v2/papers/generate')
      .send({ topic: 'test', config: { ...config, wordCount: 1 } })
      .expect(400);
    await request(app.getHttpServer()).get('/v3/papers/models').expect(404);
    await request(app.getHttpServer())
      .get('/v2/papers/tasks/missing')
      .expect(404);
  });
});
