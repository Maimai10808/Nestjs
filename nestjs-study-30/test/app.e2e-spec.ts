import { NestFactory } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppModule } from '../dist/app.module.js';
import { EventsService } from '../dist/events/events.service.js';
import { AuditService } from '../dist/audit/audit.service.js';
import { AgentFailedEvent } from '../dist/events/agent.events.js';
import request from 'supertest';
import { startApp } from './runtime.js';

describe('Agent 事件真实入口', () => {
  let server: Awaited<ReturnType<typeof startApp>>;
  beforeAll(async () => {
    server = await startApp();
  });
  afterAll(async () => {
    await server?.close();
  });
  it('emitAsync 等待失败事件监听器，默认隔离监听器异常', async () => {
    const app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
    try {
      const audit = app.get(AuditService);
      vi.spyOn(audit, 'record').mockImplementationOnce(() => {
        throw new Error('listener failed');
      });
      await expect(
        app
          .get(EventEmitter2)
          .emitAsync(
            'agent.failed',
            new AgentFailedEvent(
              9,
              1,
              1001,
              'Mock failure',
              new Date().toISOString(),
            ),
          ),
      ).resolves.toBeDefined();
      expect(app.get(EventsService).findAll()[0].eventName).toBe(
        'agent.failed',
      );
    } finally {
      await app.close();
    }
  });
  it('一次执行通知、统计、审计和真实事件名', async () => {
    const result = await request(server.baseUrl)
      .post('/agents/1/run')
      .expect(201);
    expect(result.body.status).toBe('completed');
    const history = await request(server.baseUrl)
      .get('/events/history')
      .expect(200);
    expect(
      history.body.map((item: { eventName: string }) => item.eventName),
    ).toEqual(['agent.started', 'agent.completed']);
    const notifications = await request(server.baseUrl)
      .get('/notifications')
      .expect(200);
    expect(notifications.body).toHaveLength(1);
    const analytics = await request(server.baseUrl)
      .get('/analytics')
      .expect(200);
    expect(analytics.body).toEqual([
      { userId: 1001, totalExecutions: 1, totalTokens: 2500 },
    ]);
    const audit = await request(server.baseUrl).get('/audit').expect(200);
    expect(audit.body[0].action).toBe('agent.completed');
    await request(server.baseUrl).post('/agents/999/run').expect(404);
  });
});
