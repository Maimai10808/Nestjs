import request from 'supertest';
import { startApp } from './runtime.js';

describe('Agent 日志真实入口', () => {
  let server: Awaited<ReturnType<typeof startApp>>;
  beforeAll(async () => {
    server = await startApp();
  });
  afterAll(async () => {
    await server?.close();
  });
  it('执行 Mock 模型并记录上下文和执行历史', async () => {
    await request(server.baseUrl).get('/agents').expect(200);
    const result = await request(server.baseUrl)
      .post('/agents/1/run')
      .expect(201);
    expect(result.body.status).toBe('completed');
    const records = await request(server.baseUrl)
      .get('/agents/executions')
      .expect(200);
    expect(records.body).toHaveLength(1);
    expect(server.output()).toContain('[AgentsService]');
    expect(server.output()).toContain('[AiService]');
    expect(server.output()).toContain('execution_started');
  });
  it('拒绝不存在的 Agent 和非数字 ID', async () => {
    await request(server.baseUrl).post('/agents/999/run').expect(404);
    await request(server.baseUrl).post('/agents/no/run').expect(400);
  });
});
