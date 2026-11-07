import { Test, TestingModule } from '@nestjs/testing';
import { AgentWorkerController } from './agent-worker.controller.js';
import { AgentWorkerService } from './agent-worker.service.js';

describe('AgentWorkerController', () => {
  let agentWorkerController: AgentWorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AgentWorkerController],
      providers: [AgentWorkerService],
    }).compile();

    agentWorkerController = app.get<AgentWorkerController>(AgentWorkerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(agentWorkerController.getHello()).toBe('Hello World!');
    });
  });
});
