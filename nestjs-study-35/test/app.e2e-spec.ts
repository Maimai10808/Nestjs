import request from 'supertest';
import { startRuntime } from './runtime.js';

describe('Session authentication over HTTP', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => {
    runtime = await startRuntime({
      SESSION_SECRET: 'local-test-session-secret-at-least-32-characters',
    });
  });
  afterAll(async () => {
    await runtime?.stop();
  });
  it('persists preferences, rotates IDs, isolates users, and clears logout cookies', async () => {
    const robin = request.agent(runtime.url);
    const alan = request.agent(runtime.url);
    await request(runtime.url).get('/agents/my').expect(401);
    const login = await robin
      .post('/auth/login')
      .send({ email: 'robin@example.com', password: '123456' })
      .expect(201);
    expect(login.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(login.headers['set-cookie'][0]).toContain('SameSite=Lax');
    await robin
      .get('/agents/my')
      .expect(200)
      .expect((res) =>
        expect(res.body.map((a: { userId: number }) => a.userId)).toEqual([
          1001, 1001,
        ]),
      );
    await alan
      .post('/auth/login')
      .send({ email: 'alan@example.com', password: '123456' })
      .expect(201);
    await alan
      .get('/agents/my')
      .expect(200)
      .expect((res) =>
        expect(res.body.map((a: { userId: number }) => a.userId)).toEqual([
          1002,
        ]),
      );
    await robin
      .post('/session/preferences')
      .send({ theme: 'dark', language: 'en' })
      .expect(201);
    const old = await robin.get('/session/info').expect(200);
    await robin
      .post('/session/regenerate')
      .expect(201)
      .expect((res) => expect(res.body.sessionId).not.toBe(old.body.sessionId));
    await robin
      .get('/session/preferences')
      .expect(200)
      .expect((res) =>
        expect(res.body.preferences).toEqual({ theme: 'dark', language: 'en' }),
      );
    await robin.get('/session/visits').expect(200).expect({ visits: 1 });
    await robin.get('/session/visits').expect(200).expect({ visits: 2 });
    await robin
      .post('/session/preferences')
      .send({ theme: 'invalid', language: 'en' })
      .expect(400);
    const logout = await robin.post('/auth/logout').expect(201);
    expect(logout.headers['set-cookie'][0]).toContain('agent.sid=;');
    expect(logout.headers['set-cookie'][0]).toContain('Path=/');
    await robin.get('/auth/me').expect(401);
  });
  it('rejects invalid credentials and malformed DTOs', async () => {
    await request(runtime.url)
      .post('/auth/login')
      .send({ email: 'robin@example.com', password: 'wrong-password' })
      .expect(401);
    await request(runtime.url)
      .post('/auth/login')
      .send({ email: 'invalid', password: '123' })
      .expect(400);
  });
  it('rejects replay of server sessions after rotation and logout', async () => {
    const login = await request(runtime.url).post('/auth/login').send({ email: 'robin@example.com', password: '123456' }).expect(201);
    const originalCookie = String(login.headers['set-cookie'][0]).split(';')[0];
    await request(runtime.url).get('/auth/me').set('Cookie', originalCookie).expect(200);
    const rotated = await request(runtime.url).post('/session/regenerate').set('Cookie', originalCookie).expect(201);
    const rotatedCookie = String(rotated.headers['set-cookie'][0]).split(';')[0];
    expect(rotatedCookie).not.toBe(originalCookie);
    await request(runtime.url).get('/auth/me').set('Cookie', originalCookie).expect(401);
    await request(runtime.url).get('/auth/me').set('Cookie', rotatedCookie).expect(200);
    await request(runtime.url).post('/auth/logout').set('Cookie', rotatedCookie).expect(201);
    await request(runtime.url).get('/auth/me').set('Cookie', rotatedCookie).expect(401);
  });

});
