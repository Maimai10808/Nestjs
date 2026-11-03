import {
  QueueEventsHost,
  QueueEventsListener,
  OnQueueEvent,
} from '@nestjs/bullmq';

import { Logger } from '@nestjs/common';

@QueueEventsListener('agent-tasks')
export class AgentQueueEventsListener extends QueueEventsHost {
  private readonly logger = new Logger(
    AgentQueueEventsListener.name,
  );

  // 任务进入执行状态
  @OnQueueEvent('active')
  onActive({
    jobId,
  }: {
    jobId: string;
    prev?: string;
  }) {
    this.logger.log(
      `[Queue Event] 任务 ${jobId} 开始执行`,
    );
  }

  // 任务执行成功
  @OnQueueEvent('completed')
  onCompleted({
    jobId,
  }: {
    jobId: string;
    returnvalue: string;
    prev?: string;
  }) {
    this.logger.log(
      `[Queue Event] 任务 ${jobId} 执行成功`,
    );
  }

  // 任务执行失败
  @OnQueueEvent('failed')
  onFailed({
    jobId,
    failedReason,
  }: {
    jobId: string;
    failedReason: string;
    prev?: string;
  }) {
    this.logger.error(
      `[Queue Event] 任务 ${jobId} 执行失败：${failedReason}`,
    );
  }

  // 任务执行进度更新
  @OnQueueEvent('progress')
  onProgress({
    jobId,
    data,
  }: {
    jobId: string;
    data: number | object;
  }) {
    this.logger.log(
      `[Queue Event] 任务 ${jobId} 进度：${JSON.stringify(data)}`,
    );
  }
}
