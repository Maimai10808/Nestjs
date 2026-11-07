import request from 'supertest';
import { startRuntime } from './runtime.js';

describe('roles, permissions, and CASL resource policies', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => { runtime = await startRuntime(); });
  afterAll(async () => { await runtime?.stop(); });

  it('preserves the root and derives roles only from server-side mock identities', async () => {
    await request(runtime.url).get('/').expect(200).expect('Hello World!');
    await request(runtime.url).get('/agents').expect(401);
    await request(runtime.url).get('/admin/users').set('Authorization', 'Bearer demo-robin-token').set('X-Role', 'admin').expect(403);
    const admin = await request(runtime.url).get('/admin/users').set('Authorization', 'Bearer demo-admin-token').expect(200);
    expect(admin.body).toHaveLength(3);
    expect(JSON.stringify(admin.body)).not.toContain('passwordHash');
  });

  it('restricts resources by owner and forbids deleting running agents for every role', async () => {
    const robin = request(runtime.url);
    const list = await robin.get('/agents').set('Authorization', 'Bearer demo-robin-token').expect(200);
    expect(list.body.map((a: { id: number }) => a.id)).toEqual([1, 2]);
    await robin.patch('/agents/3').set('Authorization', 'Bearer demo-robin-token').send({ name: 'stolen' }).expect(403);
    await robin.delete('/agents/2').set('Authorization', 'Bearer demo-admin-token').expect(403);
    await robin.post('/agents').set('Authorization', 'Bearer demo-robin-token').send({ name: 'new', model: 'mock', ownerId: 1002 }).expect(400);
    await robin.patch('/agents/1').set('Authorization', 'Bearer demo-robin-token').send({ name: null }).expect(400);
    const created = await robin.post('/agents').set('Authorization', 'Bearer demo-robin-token').send({ name: 'new', model: 'mock' }).expect(201);
    expect(created.body.ownerId).toBe(1001);
    await robin.delete(`/agents/${created.body.id}`).set('Authorization', 'Bearer demo-robin-token').expect(200);
  });
});
