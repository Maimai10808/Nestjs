import { validateSync } from 'class-validator';
import { RunAgentDto } from './run-agent.dto.js';

describe('BullMQ 任务优先级边界', () => {
  it('接受合法整数，拒绝超出 BullMQ 上限的请求', () => {
    const dto = Object.assign(new RunAgentDto(), {
      agentId: 2,
      userId: 1001,
      input: 'research queues',
      priority: 2097151,
    });
    expect(validateSync(dto)).toHaveLength(0);
    dto.priority = 2097152;
    expect(
      validateSync(dto).some((error) => error.property === 'priority'),
    ).toBe(true);
  });
});
