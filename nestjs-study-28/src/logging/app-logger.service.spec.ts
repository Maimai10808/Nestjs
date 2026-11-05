import { Test } from '@nestjs/testing';
import { AppLogger } from './app-logger.service.js';
import { LoggingModule } from './logging.module.js';

it('transient Logger 为两个消费者保留各自上下文', async () => {
  const module = await Test.createTestingModule({
    imports: [LoggingModule],
    providers: ['ConsumerA', 'ConsumerB'].map((name) => ({
      provide: name,
      inject: [AppLogger],
      useFactory: (logger: AppLogger) => {
        logger.setContext(name);
        return logger;
      },
    })),
  }).compile();
  try {
    const a = module.get<AppLogger>('ConsumerA');
    const b = module.get<AppLogger>('ConsumerB');
    expect(a).not.toBe(b);
    const output = vi
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    try {
      a.logAgentEvent(1, 'done');
      b.logAgentEvent(2, 'done');
      const lines = output.mock.calls.map(([line]) => String(line)).join('');
      expect(lines).toContain('[ConsumerA]');
      expect(lines).toContain('[ConsumerB]');
    } finally {
      output.mockRestore();
    }
  } finally {
    await module.close();
  }
});
