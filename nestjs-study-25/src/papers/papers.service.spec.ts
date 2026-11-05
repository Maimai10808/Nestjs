import { PapersService } from './papers.service.js';
describe('论文任务生命周期', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('关闭 provider 时取消尚未执行的模拟任务', () => {
    vi.useFakeTimers();
    const service = new PapersService();
    service.generateV2({
      topic: 'test',
      config: {
        paperType: 'research',
        wordCount: 1000,
        citationStyle: 'APA',
        model: 'gpt-4.1',
      },
    });
    service.onModuleDestroy();
    vi.advanceTimersByTime(3000);
    expect(service.findTask('task-1001').status).toBe('pending');
    expect(vi.getTimerCount()).toBe(0);
  });
});
