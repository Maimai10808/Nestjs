import { get } from 'node:http';
import { startRuntime } from './runtime.js';

async function readStream(url: string, until?: string) {
  return new Promise<string>((resolve, reject) => {
    let text = '';
    const req = get(url, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      expect(res.headers['content-type']).toContain('text/event-stream');
      res.on('data', (chunk) => {
        text += String(chunk);
        if (until && text.includes(until)) {
          req.destroy();
          resolve(text);
        }
      });
      res.on('end', () => resolve(text));
    });
    req.on('error', reject);
  });
}

describe('SSE framing, completion, and connection lifecycle', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => {
    runtime = await startRuntime();
  });
  afterAll(async () => {
    await runtime?.stop();
  });
  it('emits five progress stages and completes', async () => {
    const text = await readStream(`${runtime.url}/agents/research/stream`);
    expect(text.match(/event: progress/g)).toHaveLength(4);
    expect(text).toContain('event: completed');
    expect(text).toContain('"progress":100');
    expect(text).toContain('id: 5');
  }, 10000);
  it('emits tokens followed by completion and a deliberate failure event', async () => {
    const text = await readStream(`${runtime.url}/agents/research/tokens`);
    expect(text.match(/event: token/g)).toHaveLength(10);
    expect(text).toContain('event: completed');
    const failed = await readStream(`${runtime.url}/agents/research/error`);
    expect(failed).toContain('event: started');
    expect(failed).toContain('event: failed');
    expect(failed).toContain('AI_MODEL_TIMEOUT');
  }, 10000);
  it('releases the timer after the HTTP client disconnects', async () => {
    await readStream(
      `${runtime.url}/agents/research/cleanup`,
      '正在执行第 1 个步骤',
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(runtime.output()).toContain('客户端连接结束，定时器已清理');
  });
  it('closes a session when disconnected during asynchronous initialization', async () => {
    const before = runtime.output().split('AI Session 已释放').length;
    await new Promise<void>((resolve) => {
      const req = get(`${runtime.url}/agents/research/session`);
      req.on('error', () => {});
      setTimeout(() => {
        req.destroy();
        resolve();
      }, 150);
    });
    await new Promise((resolve) => setTimeout(resolve, 2200));
    expect(runtime.output().split('AI Session 已释放').length).toBe(before + 1);
  });
  it('closes an initialized session after unsubscribe', async () => {
    const before = runtime.output().split('AI Session 已释放').length;
    await readStream(
      `${runtime.url}/agents/research/session`,
      'event: started',
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(runtime.output().split('AI Session 已释放').length).toBe(before + 1);
  });
});
