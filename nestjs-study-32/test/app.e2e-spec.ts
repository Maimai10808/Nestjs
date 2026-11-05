import request from 'supertest';
import { mkdtemp, readdir, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startApp } from './runtime.js';

describe('知识库上传真实入口', () => {
  let server: Awaited<ReturnType<typeof startApp>>;
  let cwd: string;
  beforeAll(async () => {
    cwd = await mkdtemp(join(tmpdir(), 'nestjs-knowledge-test-'));
    server = await startApp(cwd);
  });
  afterAll(async () => {
    await server?.close();
    await rm(cwd, { recursive: true, force: true });
  });
  it('保存 UTF-8 文本、转换 multipart metadata、删除文件', async () => {
    const bytes = Buffer.from('# Agent 知识库');
    const result = await request(server.baseUrl)
      .post('/knowledge/upload')
      .field('agentId', '1')
      .field('description', '说明')
      .attach('file', bytes, 'notes.md')
      .expect(201);
    expect(result.body.agentId).toBe(1);
    expect(result.body.mimeType).toBe('text/markdown');
    expect(
      await readFile(join(cwd, 'uploads', result.body.storedName as string)),
    ).toEqual(bytes);
    await request(server.baseUrl)
      .get(`/knowledge/files/${result.body.id}`)
      .expect(200);
    await request(server.baseUrl)
      .delete(`/knowledge/files/${result.body.id}`)
      .expect(200);
    await request(server.baseUrl)
      .get(`/knowledge/files/${result.body.id}`)
      .expect(404);
    expect(await readdir(join(cwd, 'uploads'))).toHaveLength(0);
  });
  it('拒绝缺文件、非法内容、非法 metadata 与超限文件', async () => {
    await request(server.baseUrl)
      .post('/knowledge/upload')
      .field('agentId', '1')
      .expect(400);
    for (const [name, bytes] of [
      ['fake.pdf', Buffer.from('not pdf')],
      ['evil.exe', Buffer.from('hello')],
      ['binary.txt', Buffer.from([0xff, 0xfe, 0x00])],
    ] as const) {
      await request(server.baseUrl)
        .post('/knowledge/upload')
        .field('agentId', '1')
        .attach('file', bytes, name)
        .expect(400);
    }
    await request(server.baseUrl)
      .post('/knowledge/upload')
      .field('agentId', '0')
      .attach('file', Buffer.from('notes'), 'notes.txt')
      .expect(400);
    await request(server.baseUrl)
      .post('/knowledge/upload')
      .field('agentId', '1')
      .attach('file', Buffer.alloc(5 * 1024 * 1024 + 1, 65), 'big.txt')
      .expect(413);
    expect(await readdir(join(cwd, 'uploads'))).toHaveLength(0);
  });
  it('接受带 PDF 头的教学样本', async () => {
    const result = await request(server.baseUrl)
      .post('/knowledge/upload')
      .field('agentId', '2')
      .attach('file', Buffer.from('%PDF-1.7\n%%EOF'), 'paper.pdf')
      .expect(201);
    expect(result.body.mimeType).toBe('application/pdf');
    await request(server.baseUrl)
      .delete(`/knowledge/files/${result.body.id}`)
      .expect(200);
  });
});
