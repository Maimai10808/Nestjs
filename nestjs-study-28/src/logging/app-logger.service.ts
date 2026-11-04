import {
  ConsoleLogger,
  Injectable,
  Scope,
} from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class AppLogger extends ConsoleLogger {
  // 自定义业务日志
  logAgentEvent(
    agentId: number,
    event: string,
  ): void {
    this.log(
      `[AI_AGENT] agentId=${agentId} event=${event}`,
    );
  }

  // 自定义任务执行日志
  logExecution(
    agentId: number,
    durationMs: number,
  ): void {
    this.log(
      `[AI_EXECUTION] agentId=${agentId} duration=${durationMs}ms`,
    );
  }

  // 自定义 AI API 错误日志
  logAiError(
    agentId: number,
    error: Error,
  ): void {
    this.error(
      `[AI_ERROR] agentId=${agentId} message=${error.message}`,
      error.stack,
    );
  }
}
