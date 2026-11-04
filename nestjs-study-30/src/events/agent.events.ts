export const AgentEventNames = {
  STARTED: 'agent.started',
  COMPLETED: 'agent.completed',
  FAILED: 'agent.failed',
} as const;

export class AgentStartedEvent {
  constructor(
    public readonly executionId: number,
    public readonly agentId: number,
    public readonly userId: number,
    public readonly startedAt: string,
  ) {}
}

export class AgentCompletedEvent {
  constructor(
    public readonly executionId: number,
    public readonly agentId: number,
    public readonly userId: number,
    public readonly tokensUsed: number,
    public readonly durationMs: number,
    public readonly completedAt: string,
  ) {}
}

export class AgentFailedEvent {
  constructor(
    public readonly executionId: number,
    public readonly agentId: number,
    public readonly userId: number,
    public readonly reason: string,
    public readonly failedAt: string,
  ) {}
}
