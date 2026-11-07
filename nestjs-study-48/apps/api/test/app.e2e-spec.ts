import { NestFactory } from '@nestjs/core';
import { ValidationPipe, type INestApplication, type INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { createServer } from 'node:net';
import request from 'supertest';

async function freePort(): Promise<number> {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No TCP port');
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  return address.port;
}

describe('HTTP API to TCP Agent Worker', () => {
  let api: INestApplication;
  let worker: INestMicroservice;
  let port: number;
  beforeAll(async () => {
    port = await freePort();
    process.env.WORKER_TCP_PORT = String(port);
    const { AppModule: WorkerModule } = await import('../../../dist/agent-worker/apps/agent-worker/src/agent-worker.module.js');
    worker = await NestFactory.createMicroservice(WorkerModule, {
      transport: Transport.TCP, options: { host: '127.0.0.1', port }, logger: false,
    });
    await worker.listen();
    const { AppModule } = await import('../../../dist/api/apps/api/src/app.module.js');
    api = await NestFactory.create(AppModule, { logger: false });
    api.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    await api.listen(0, '127.0.0.1');
  });
  afterAll(async () => {
    await api?.close();
    await worker?.close();
    delete process.env.WORKER_TCP_PORT;
  });

  it('validates requests and returns the Worker analysis result', async () => {
    await request(api.getHttpServer()).post('/research/analyze').send({ topic: 'x', model: 'invalid' }).expect(400);
    const response = await request(api.getHttpServer()).post('/research/analyze')
      .send({ topic: 'NestJS agent architecture', model: 'gpt-4.1' }).expect(201);
    expect(response.body).toMatchObject({ topic: 'NestJS agent architecture', model: 'gpt-4.1' });
    expect(response.body.summary).toContain('模拟完成');
  }, 10000);

  it('queries models through the real TCP transport', async () => {
    const response = await request(api.getHttpServer()).get('/research/models').expect(200);
    expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'gpt-4.1' })]));
  });

  it('delivers submitted events to the Worker', async () => {
    const { ResearchService } = await import('../../../dist/agent-worker/apps/agent-worker/src/research/research.service.js');
    const received = vi.spyOn(worker.get(ResearchService), 'handleSubmitted');
    const response = await request(api.getHttpServer()).post('/research/submit')
      .send({ topic: 'Event driven research', model: 'gpt-4.1' }).expect(201);
    await vi.waitFor(() => expect(received).toHaveBeenCalledWith(expect.objectContaining({ taskId: response.body.taskId })));
    received.mockRestore();
  });

  it('maps a slow response to HTTP 504 without claiming Worker cancellation', async () => {
    await request(api.getHttpServer()).get('/research/slow').expect(504);
  }, 10000);
});
