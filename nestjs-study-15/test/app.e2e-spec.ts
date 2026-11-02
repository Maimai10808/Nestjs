import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { AgentsService } from '../dist/agents/agents.service.js';
import { DatabaseService } from '../dist/infrastructure/database.service.js';

describe('生命周期与任务排空', () => {
  let app: INestApplication;
  let closed = false;

  beforeEach(async () => {
    const fixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = fixture.createNestApplication();
    closed = false;
    await app.init();
  });

  afterEach(async () => { if (!closed) await app.close(); });

  it('初始化资源、查询任务，并在关闭期间保留资源直到运行任务完成', async () => {
    const database = app.get(DatabaseService);
    const agents = app.get(AgentsService);
    expect(database.isConnected()).toBe(true);
    const response = await request(app.getHttpServer()).post('/agents/tasks').expect(201);
    const id = response.body.id as string;
    expect(response.body.status).toBe('running');
    await request(app.getHttpServer()).get(`/agents/tasks/${id}`).expect(200);

    const draining = vi.spyOn(agents, 'beforeApplicationShutdown');
    const closing = app.close();
    await vi.waitFor(() => expect(draining).toHaveBeenCalled());
    expect(database.isConnected()).toBe(true);
    expect(() => agents.createTask()).toThrow('系统正在关闭');
    await closing;
    closed = true;
    expect(agents.findTask(id)?.status).toBe('completed');
    expect(database.isConnected()).toBe(false);
  }, 15000);

  it('不存在的任务返回 404', async () => {
    await request(app.getHttpServer()).get('/agents/tasks/missing').expect(404);
  });
});
