import { AgentsService } from './agents.service.js';

describe('task approval and cancellation', () => {
  it('resumes only after approval and removes the execution', async () => {
    const service = new AgentsService();
    const task = service.createTask('owner', 'repair types');
    service.registerExecution(task.id);
    service.updateStatus(task.id, 'waiting_approval', 50);
    const approval = service.waitForApproval(task.id);
    service.approveTask(task.id);
    await expect(approval).resolves.toBeUndefined();
    service.finishExecution(task.id);
    expect(() => service.approveTask(task.id)).toThrow();
  });

  it('rejects a pending approval when cancelled', async () => {
    const service = new AgentsService();
    const task = service.createTask('owner', 'repair types');
    const signal = service.registerExecution(task.id);
    service.updateStatus(task.id, 'waiting_approval', 50);
    const approval = service.waitForApproval(task.id);
    const rejected = expect(approval).rejects.toThrow('任务已取消');
    service.abortTask(task.id);
    await rejected;
    expect(signal.aborted).toBe(true);
    service.finishExecution(task.id);
  });

  it('cancels pending work on application shutdown', async () => {
    const service = new AgentsService();
    const task = service.createTask('owner', 'repair types');
    const signal = service.registerExecution(task.id);
    service.updateStatus(task.id, 'waiting_approval', 50);
    const approval = service.waitForApproval(task.id);
    const rejected = expect(approval).rejects.toThrow('任务已取消');
    service.onModuleDestroy();
    await rejected;
    expect(signal.aborted).toBe(true);
    expect(service.findOne(task.id).status).toBe('cancelled');
  });
});
