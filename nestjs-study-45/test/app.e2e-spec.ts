import type { INestApplication } from '@nestjs/common';
import type { Socket } from 'socket.io-client';
import request from 'supertest';
import { startApp, connect, event, ack } from './runtime.js';

describe('Coding Agent Socket.IO workflow', () => {
  let app: INestApplication;
  const sockets: Socket[] = [];
  beforeEach(async () => { app = await startApp(); });
  afterEach(async () => {
    for (const socket of sockets.splice(0)) socket.disconnect();
    await app.close();
  });

  it('reports health and validates start messages', async () => {
    await request(app.getHttpServer()).get('/health').expect(200);
    const socket = await connect(await app.getUrl()); sockets.push(socket);
    const invalid = event(socket, 'exception');
    socket.emit('agent.start', { prompt: 'x' });
    expect(await invalid).toEqual([expect.objectContaining({
      property: 'prompt',
      constraints: expect.objectContaining({ minLength: expect.any(String) }),
    })]);
  });

  it('requires approval, isolates owners, and completes the workflow', async () => {
    const owner = await connect(await app.getUrl()); sockets.push(owner);
    const other = await connect(await app.getUrl()); sockets.push(other);
    const approval = event<{ taskId: string }>(owner, 'agent.approval_required');
    await ack(owner, 'agent.start', { prompt: 'repair TypeScript errors' });
    const { taskId } = await approval;
    expect(await ack(owner, 'agent.status', { taskId })).toMatchObject({ status: 'waiting_approval' });
    const denied = event<{ message: string }>(other, 'exception');
    other.emit('agent.approve', { taskId });
    expect(await denied).toMatchObject({ message: '无权操作该任务' });
    const completed = event(owner, 'agent.completed');
    expect(await ack(owner, 'agent.approve', { taskId })).toMatchObject({ approved: true });
    await completed;
    expect(await ack(owner, 'agent.status', { taskId })).toMatchObject({ status: 'completed', progress: 100 });
  }, 20000);

  it('cancels while waiting for approval', async () => {
    const owner = await connect(await app.getUrl()); sockets.push(owner);
    const approval = event<{ taskId: string }>(owner, 'agent.approval_required');
    await ack(owner, 'agent.start', { prompt: 'repair TypeScript errors' });
    const { taskId } = await approval;
    const cancelled = event(owner, 'agent.cancelled');
    await ack(owner, 'agent.cancel', { taskId });
    await cancelled;
    expect(await ack(owner, 'agent.status', { taskId })).toMatchObject({ status: 'cancelled' });
  }, 15000);

  it('cancels the connection-owned task on disconnect', async () => {
    const owner = await connect(await app.getUrl()); sockets.push(owner);
    const approval = event<{ taskId: string }>(owner, 'agent.approval_required');
    await ack(owner, 'agent.start', { prompt: 'repair TypeScript errors' });
    const { taskId } = await approval;
    const { AgentsService } = await import('../dist/agents/agents.service.js');
    const service = app.get(AgentsService);
    owner.disconnect();
    await vi.waitFor(() => expect(service.findOne(taskId).status).toBe('cancelled'));
  }, 15000);
});
