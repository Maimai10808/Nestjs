import { Test } from '@nestjs/testing';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';

import { SchedulerRegistry } from '@nestjs/schedule';

describe('注册静态和动态调度', () => {
  let app: INestApplication;
  let registry: SchedulerRegistry;
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
    await app.init();
    registry = app.get(SchedulerRegistry);
  });
  afterAll(async () => {
    await app.close();
  });
  it('装配三个静态装饰器', () => {
    expect(registry.getCronJobs().has('daily-research')).toBe(true);
    expect(registry.getIntervals()).toHaveLength(1);
    expect(registry.getTimeouts()).toHaveLength(1);
  });
  it('创建、暂停、恢复、删除动态 Cron，并处理冲突和表达式错误', async () => {
    const dto = {
      name: 'test-cron',
      agentId: 1,
      cronExpression: '0 0 0 1 1 *',
    };
    await request(app.getHttpServer())
      .post('/schedules/cron')
      .send(dto)
      .expect(201);
    await request(app.getHttpServer())
      .post('/schedules/cron')
      .send(dto)
      .expect(409);
    await request(app.getHttpServer())
      .post('/schedules/cron')
      .send({ ...dto, name: 'bad', cronExpression: 'bad' })
      .expect(400);
    await request(app.getHttpServer())
      .post('/schedules/cron/test-cron/pause')
      .expect(201);
    expect(registry.getCronJob(dto.name).isActive).toBe(false);
    await request(app.getHttpServer())
      .post('/schedules/cron/test-cron/resume')
      .expect(201);
    expect(registry.getCronJob(dto.name).isActive).toBe(true);
    await request(app.getHttpServer())
      .delete('/schedules/cron/test-cron')
      .expect(200);
    expect(registry.getCronJobs().has(dto.name)).toBe(false);
  });
  it('一次性任务触发后移出 registry 并生成真实执行记录', async () => {
    await request(app.getHttpServer())
      .post('/schedules/delayed')
      .send({ name: 'once', agentId: 1, delayMs: 1000 })
      .expect(201);
    await request(app.getHttpServer())
      .post('/schedules/delayed')
      .send({ name: 'bad', agentId: 1, delayMs: 1 })
      .expect(400);
    await new Promise((resolve) => setTimeout(resolve, 2200));
    expect(registry.getTimeouts()).not.toContain('once');
    const executions = await request(app.getHttpServer())
      .get('/agents/executions')
      .expect(200);
    expect(
      executions.body.some((x: { trigger: string }) => x.trigger === 'delayed'),
    ).toBe(true);
  });
  it('关闭应用后 registry 已释放 Cron、Interval 和 Timeout', async () => {
    await app.close();
    expect(registry.getCronJobs().size).toBe(0);
    expect(registry.getIntervals()).toHaveLength(0);
    expect(registry.getTimeouts()).toHaveLength(0);
  });
});
