import { SchedulerRegistry } from '@nestjs/schedule';
import { AgentsService } from '../agents/agents.service.js';
import { SchedulesService } from './schedules.service.js';

describe('一次性延迟任务', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('触发后移除注册记录，完成一次业务执行', async () => {
    vi.useFakeTimers();
    const registry = new SchedulerRegistry();
    const agents = new AgentsService();
    const service = new SchedulesService(registry, agents);
    service.createDelayed({ name: 'demo', agentId: 1, delayMs: 1000 });
    expect(registry.getTimeouts()).toContain('demo');
    expect(() =>
      service.createDelayed({ name: 'demo', agentId: 1, delayMs: 1000 }),
    ).toThrow('名称已存在');
    await vi.advanceTimersByTimeAsync(2000);
    expect(registry.getTimeouts()).not.toContain('demo');
    expect(agents.findExecutions()).toHaveLength(1);
    expect(agents.findExecutions()[0].trigger).toBe('delayed');
  });
});
