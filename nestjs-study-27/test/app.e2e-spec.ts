import { getQueueToken } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

describe('真实 BullMQ Worker、重试和进度', () => {
  let app: INestApplication;
  beforeAll(async () => {
    if (!process.env.REDIS_PORT)
      throw new Error('请提供独立测试 Redis 的 REDIS_PORT');
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    if (!app) return;
    const queue = app.get<Queue>(getQueueToken('agent-tasks'));
    await queue.resume();
    await app.close();
  });
  async function waitState(id: string, state: string) {
    for (let i = 0; i < 160; i++) {
      const response = await request(app.getHttpServer())
        .get(`/agents/jobs/${id}`)
        .expect(200);
      if (response.body.state === state) return response.body;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`job ${id} 未进入 ${state}`);
  }
  it('priority 超过 BullMQ 上限时先返回 400', async () => {
    await request(app.getHttpServer())
      .post('/agents/run')
      .send({
        agentId: 2,
        userId: 1001,
        input: 'test research',
        priority: 2097152,
      })
      .expect(400);
  });
  it('暂停不启动等待任务，恢复后 Worker 完成并可读取结果', async () => {
    await request(app.getHttpServer()).post('/agents/queue/pause').expect(201);
    const create = await request(app.getHttpServer())
      .post('/agents/run')
      .send({ agentId: 2, userId: 1001, input: 'research queues' })
      .expect(201);
    const id = create.body.jobId as string;
    const stats = await request(app.getHttpServer())
      .get('/agents/queue/stats')
      .expect(200);
    expect(stats.body.counts.paused).toBeGreaterThanOrEqual(1);
    const pending = await request(app.getHttpServer())
      .get(`/agents/jobs/${id}/result`)
      .expect(200);
    expect(pending.body.state).toBe('waiting');
    await request(app.getHttpServer()).post('/agents/queue/resume').expect(201);
    const done = await waitState(id, 'completed');
    expect(done.progress).toBe(100);
    const result = await request(app.getHttpServer())
      .get(`/agents/jobs/${id}/result`)
      .expect(200);
    expect(result.body.result.output).toContain('research queues');
    await request(app.getHttpServer())
      .post(`/agents/jobs/${id}/retry`)
      .expect(400);
  }, 20000);
  it('不支持的 Agent 由 Worker 失败，三次尝试后允许手动重试', async () => {
    const create = await request(app.getHttpServer())
      .post('/agents/run')
      .send({ agentId: 99, userId: 1001, input: 'invalid agent' })
      .expect(201);
    const id = create.body.jobId as string;
    const failed = await waitState(id, 'failed');
    expect(failed.attemptsMade).toBe(3);
    expect(failed.failedReason).toContain('99');
    await request(app.getHttpServer())
      .post(`/agents/jobs/${id}/retry`)
      .expect(201);
    await waitState(id, 'failed');
    await request(app.getHttpServer()).get('/agents/jobs/missing').expect(404);
  }, 25000);
});

// Runs after the AppModule suite has closed its in-process Worker.
describe('main 进程信号关闭', () => {
  it('SIGTERM 等待 active 任务完成并关闭真实 Worker', async () => {
    const { verifyWorkerShutdown } = await import('./shutdown-scenario.js');
    await expect(verifyWorkerShutdown()).resolves.toEqual({
      state: 'completed',
      progress: 100,
    });
  }, 15000);
});
