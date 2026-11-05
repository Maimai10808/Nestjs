import request from 'supertest';
import { startApp } from './runtime.js';

describe('Cookie 会话真实入口', () => {
  let server: Awaited<ReturnType<typeof startApp>>;
  beforeAll(async () => {
    server = await startApp();
  });
  afterAll(async () => {
    await server?.close();
  });
  it('登录、隔离用户数据、注销并撤销原 session', async () => {
    await request(server.baseUrl).get('/agents/my').expect(401);
    const robin = request.agent(server.baseUrl);
    const login = await robin
      .post('/auth/login')
      .send({ email: 'robin@example.com', password: '123456' })
      .expect(201);
    expect(login.body.user.password).toBeUndefined();
    const cookies = login.headers['set-cookie'] as unknown as string[];
    expect(cookies[0]).toContain('HttpOnly');
    expect(cookies[0]).toContain('SameSite=Lax');
    const mine = await robin.get('/agents/my').expect(200);
    expect(mine.body.map((item: { userId: number }) => item.userId)).toEqual([
      1001, 1001,
    ]);
    const alan = request.agent(server.baseUrl);
    await alan
      .post('/auth/login')
      .send({ email: 'alan@example.com', password: '123456' })
      .expect(201);
    const other = await alan.get('/agents/my').expect(200);
    expect(other.body.map((item: { userId: number }) => item.userId)).toEqual([
      1002,
    ]);
    const logout = await robin.post('/auth/logout').expect(201);
    expect(logout.headers['set-cookie'][0]).toContain(
      'Expires=Thu, 01 Jan 1970',
    );
    await request(server.baseUrl)
      .get('/auth/me')
      .set('Cookie', cookies)
      .expect(401);
  });
  it('拒绝非法登录和无效偏好，同时往返合法偏好 Cookie', async () => {
    await request(server.baseUrl)
      .post('/auth/login')
      .send({ email: 'bad', password: 'x' })
      .expect(400);
    await request(server.baseUrl)
      .post('/auth/login')
      .send({ email: 'robin@example.com', password: 'wrong1' })
      .expect(401);
    for (const body of [
      {},
      { theme: 'admin', language: 'zh-CN' },
      { theme: 'dark', language: 'xx' },
    ]) {
      await request(server.baseUrl)
        .post('/cookies/preferences')
        .send(body)
        .expect(400);
    }
    const browser = request.agent(server.baseUrl);
    await browser
      .post('/cookies/preferences')
      .send({ theme: 'dark', language: 'en-US' })
      .expect(201);
    const result = await browser.get('/cookies/preferences').expect(200);
    expect(result.body).toEqual({ theme: 'dark', language: 'en-US' });
  });
  it('生产模式登录 Cookie 带 Secure', async () => {
    const production = await startApp(process.cwd(), {
      NODE_ENV: 'production',
    });
    try {
      const result = await request(production.baseUrl)
        .post('/auth/login')
        .send({ email: 'robin@example.com', password: '123456' })
        .expect(201);
      expect(result.headers['set-cookie'][0]).toContain('Secure');
    } finally {
      await production.close();
    }
  });
});
