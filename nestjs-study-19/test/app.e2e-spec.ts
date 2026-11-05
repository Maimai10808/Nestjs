import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { AgentsService } from '../dist/agents/agents.service.js';
import {
  AgentTask,
  AgentTaskStatus,
} from '../dist/tasks/entities/agent-task.entity.js';

// synchronize 会建表；明确选择专用学习数据库后才允许测试。
if (process.env.RUN_DATABASE_E2E !== '1') {
  throw new Error(
    '请配置专用 DATABASE_* 并设置 RUN_DATABASE_E2E=1；不要连接生产数据库',
  );
}
const { AppModule } = await import('../dist/app.module.js');

describe('PostgreSQL repositories and relation lifecycle', () => {
  let app: INestApplication;
  let userId: number;
  let email: string;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  beforeEach(async () => {
    email = `study-${randomUUID()}@example.test`;
    const user = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Learner', email })
      .expect(201);
    userId = user.body.id;
  });
  afterEach(async () => {
    await request(app.getHttpServer()).delete(`/users/${userId}`);
  });
  afterAll(async () => {
    await app?.close();
  });

  it('persists user-agent-task relations and cascades deletion', async () => {
    const agent = await request(app.getHttpServer())
      .post('/agents')
      .send({
        name: 'Research',
        description: 'SQL demo',
        model: 'mock',
        userId,
      })
      .expect(201);
    const task = await request(app.getHttpServer())
      .post('/tasks')
      .send({ agentId: agent.body.id, input: 'Explain relations' })
      .expect(201);
    expect(task.body.status).toBe('pending');
    const found = await request(app.getHttpServer())
      .get(`/agents/${agent.body.id}`)
      .expect(200);
    expect(found.body.user.id).toBe(userId);
    expect(found.body.tasks.map((t: { id: number }) => t.id)).toContain(
      task.body.id,
    );
    const done = await request(app.getHttpServer())
      .patch(`/tasks/${task.body.id}/status`)
      .send({ status: 'completed', output: 'Mock report' })
      .expect(200);
    expect(done.body.output).toBe('Mock report');
    await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
    await request(app.getHttpServer())
      .get(`/agents/${agent.body.id}`)
      .expect(404);
    await request(app.getHttpServer())
      .get(`/tasks/${task.body.id}`)
      .expect(404);
  });
  it('rejects invalid bodies and protected fields before saving', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'User', email: 'invalid' })
      .expect(400);
    await request(app.getHttpServer())
      .post('/agents')
      .send({
        name: 'Research',
        description: 'Demo',
        model: 'mock',
        userId,
        id: 99,
      })
      .expect(400);
    const agent = await request(app.getHttpServer())
      .post('/agents')
      .send({ name: 'Research', description: 'Demo', model: 'mock', userId })
      .expect(201);
    await request(app.getHttpServer())
      .patch(`/agents/${agent.body.id}`)
      .send({ name: null })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`/agents/${agent.body.id}`)
      .send({ userId: userId + 1 })
      .expect(400);
    const task = await request(app.getHttpServer())
      .post('/tasks')
      .send({ agentId: agent.body.id, input: 'Valid input' })
      .expect(201);
    await request(app.getHttpServer())
      .patch(`/tasks/${task.body.id}/status`)
      .send({ status: 'unknown' })
      .expect(400);
  });
  it('maps missing references to 404 and duplicate email to 409', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Duplicate', email })
      .expect(409);
    await request(app.getHttpServer())
      .post('/agents')
      .send({
        name: 'Research',
        description: 'Demo',
        model: 'mock',
        userId: 2147483647,
      })
      .expect(404);
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ agentId: 2147483647, input: 'Missing agent' })
      .expect(404);
  });
  it('preserves unspecified Agent fields when updating a concrete DTO', async () => {
    const agent = await request(app.getHttpServer())
      .post('/agents')
      .send({
        name: 'Research',
        description: 'Keep this',
        model: 'mock',
        userId,
      })
      .expect(201);
    const patched = await request(app.getHttpServer())
      .patch(`/agents/${agent.body.id}`)
      .send({ enabled: false })
      .expect(200);
    expect(patched.body).toMatchObject({
      name: 'Research',
      description: 'Keep this',
      model: 'mock',
      enabled: false,
      userId,
    });
    const renamed = await request(app.getHttpServer())
      .patch(`/agents/${agent.body.id}`)
      .send({ name: 'Renamed' })
      .expect(200);
    expect(renamed.body).toMatchObject({
      name: 'Renamed',
      description: 'Keep this',
      model: 'mock',
      enabled: false,
    });
    const unchanged = await request(app.getHttpServer())
      .patch(`/agents/${agent.body.id}`)
      .send({})
      .expect(200);
    expect(unchanged.body).toMatchObject({ name: 'Renamed', description: 'Keep this', model: 'mock', enabled: false });
    const stored = await request(app.getHttpServer())
      .get(`/agents/${agent.body.id}`)
      .expect(200);
    expect(stored.body).toMatchObject({
      name: 'Renamed',
      description: 'Keep this',
      model: 'mock',
      enabled: false,
    });
  });
  it('does not reconcile a stale task collection during an Agent scalar patch', async () => {
    const agent = await request(app.getHttpServer())
      .post('/agents')
      .send({ name: 'Research', description: 'Demo', model: 'mock', userId })
      .expect(201);
    const agents = app.get(AgentsService);
    const taskRepository = app.get(DataSource).getRepository(AgentTask);
    const originalFindOne = agents.findOne.bind(agents);
    let concurrentTaskId = 0;
    // 只协调真实数据库操作的交错，不替换实体、查询结果或持久化实现。
    const snapshot = vi
      .spyOn(agents, 'findOne')
      .mockImplementationOnce(async (id) => {
        const loaded = await originalFindOne(id);
        const task = await taskRepository.save(
          taskRepository.create({
            agentId: agent.body.id,
            input: 'Concurrent task',
            status: AgentTaskStatus.PENDING,
            output: null,
          }),
        );
        concurrentTaskId = task.id;
        return loaded;
      });
    try {
      await request(app.getHttpServer())
        .patch(`/agents/${agent.body.id}`)
        .send({ name: 'Renamed' })
        .expect(200);
      expect(concurrentTaskId).toBeGreaterThan(0);
      await request(app.getHttpServer())
        .get(`/tasks/${concurrentTaskId}`)
        .expect(200);
    } finally {
      snapshot.mockRestore();
    }
  });
  it('rejects identifiers outside PostgreSQL integer range before queries', async () => {
    for (const resource of ['users', 'agents', 'tasks']) {
      await request(app.getHttpServer())
        .get(`/${resource}/2147483648`)
        .expect(400);
      await request(app.getHttpServer())
        .delete(`/${resource}/2147483648`)
        .expect(400);
      await request(app.getHttpServer()).get(`/${resource}/0`).expect(400);
    }
    await request(app.getHttpServer())
      .post('/agents')
      .send({
        name: 'Research',
        description: 'Demo',
        model: 'mock',
        userId: 2147483648,
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ agentId: 2147483648, input: 'Explain SQL' })
      .expect(400);
  });
});
