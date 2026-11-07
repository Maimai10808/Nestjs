import { ResearchService } from './research.service.js';

it('waits for accepted mock work before application teardown completes', async () => {
  vi.useFakeTimers();
  try {
    const service = new ResearchService();
    const task = service.create({ topic: 'Graceful application shutdown', model: 'gpt-4.1' });
    let closed = false;
    const closing = service.onModuleDestroy().then(() => { closed = true; });
    await Promise.resolve();
    expect(closed).toBe(false);
    expect(service.findOne(task.id).status).toBe('running');
    expect(() => service.create({ topic: 'Late incoming task', model: 'gpt-4.1' })).toThrow('服务正在关闭');
    await vi.runAllTimersAsync();
    await closing;
    expect(closed).toBe(true);
    expect(service.findOne(task.id)).toMatchObject({ status: 'completed', progress: 100 });
  } finally {
    vi.useRealTimers();
  }
});
