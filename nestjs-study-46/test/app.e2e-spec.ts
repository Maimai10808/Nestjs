import type { INestApplication } from '@nestjs/common';
import type { Socket } from 'socket.io-client';
import { startApp, connect, event, ack } from './runtime.js';

describe('WebSocket guards, pipes, filters, and ownership', () => {
  let app: INestApplication;
  const sockets: Socket[] = [];
  beforeEach(async () => { app = await startApp(); });
  afterEach(async () => {
    for (const socket of sockets.splice(0)) socket.disconnect();
    await app.close();
  });

  it('rejects unauthenticated messages and invalid DTOs', async () => {
    const guest = await connect(await app.getUrl()); sockets.push(guest);
    const unauthenticated = event(guest, 'exception');
    guest.emit('agent.status');
    expect(await unauthenticated).toMatchObject({ code: 'WS_ERROR', message: '身份认证失败，请提供有效 Token' });
    const user = await connect(await app.getUrl(), 'demo-robin-token'); sockets.push(user);
    const invalid = event(user, 'exception');
    user.emit('agent.execute', { prompt: 'x', model: 'unknown' });
    expect(await invalid).toMatchObject({ code: 'WS_ERROR', message: 'WebSocket 消息参数不合法' });
  });

  it('uses server-owned roles and exposes only the current user tasks', async () => {
    const robin = await connect(await app.getUrl(), 'demo-robin-token'); sockets.push(robin);
    const alan = await connect(await app.getUrl(), 'demo-alan-token'); sockets.push(alan);
    const admin = await connect(await app.getUrl(), 'demo-admin-token'); sockets.push(admin);
    const result = event(robin, 'agent.result');
    await ack(robin, 'agent.execute', { prompt: 'repair TypeScript errors', model: 'gpt-4.1' });
    expect(await result).toMatchObject({ userId: 1001, status: 'completed' });
    expect(await ack(robin, 'agent.status')).toEqual([expect.objectContaining({ userId: 1001 })]);
    expect(await ack(alan, 'agent.status')).toEqual([]);
    const denied = event(robin, 'exception');
    robin.emit('agent.admin.stats', { role: 'admin' });
    expect(await denied).toMatchObject({ message: '当前用户没有管理员权限' });
    expect(await ack(admin, 'agent.admin.stats')).toMatchObject({ totalTasks: 1 });
  }, 15000);
});
