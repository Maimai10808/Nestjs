import { setTimeout as delay } from 'node:timers/promises';
import { AgentsService } from './agents.service.js';
import type { ResearchProgress } from './agent.interface.js';

it('stops active simulation before application resources are disposed', async () => {
  const service = new AgentsService();
  const progress: ResearchProgress[] = [];
  const execution = service.execute('shutdown', (event) => progress.push(event));
  try {
    service.onModuleDestroy();
    const stopped = await Promise.race([
      execution.then(() => true),
      delay(250).then(() => false),
    ]);
    expect(stopped).toBe(true);
    expect(progress).toEqual([]);
  } finally {
    await execution;
  }
}, 8000);
