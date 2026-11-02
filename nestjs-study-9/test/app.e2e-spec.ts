import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { REDIS_CLIENT } from '../dist/redis/redis.tokens.js';

describe('Redis task API (client overridden)', () => {
  let app: INestApplication;
  const tasks = new Map<string, string>();
  const client = {
    isOpen: true,
    set: async (key: string, value: string) => {
      tasks.set(key, value);
      return 'OK';
    },
    get: async (key: string) => tasks.get(key) ?? null,
    quit: vi.fn(async () => {
      client.isOpen = false;
      return 'OK';
    }),
  };

  beforeEach(async () => {
    tasks.clear();
    client.isOpen = true;
    client.quit.mockClear();
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(REDIS_CLIENT)
      .useValue(client)
      .compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    expect(client.quit).toHaveBeenCalledOnce();
  });

  it('stores and reads a task through the injected client', async () => {
    await request(app.getHttpServer())
      .post('/agents/tasks/research-1')
      .expect(201, { taskId: 'research-1', status: 'pending' });
    await request(app.getHttpServer())
      .get('/agents/tasks/research-1')
      .expect(200, { taskId: 'research-1', status: 'pending' });
  });

  it('returns null for an unknown task rather than inventing a status', async () => {
    await request(app.getHttpServer())
      .get('/agents/tasks/missing')
      .expect(200, { taskId: 'missing', status: null });
  });
});
