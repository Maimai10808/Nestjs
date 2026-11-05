import {
  Controller,
  Sse,
  SseSignal,
  type MessageEvent,
} from '@nestjs/common';

import {
  Observable,
  EMPTY,
  finalize,
} from 'rxjs';

import { StreamingService } from './streaming.service.js';

@Controller('agents/research')
export class StreamingController {
  constructor(
    private readonly streamingService: StreamingService,
  ) {}

  // 1. Agent 执行阶段
  @Sse('stream')
  streamResearch(): Observable<MessageEvent> {
    return this.streamingService.streamResearch();
  }

  // 2. AI 文本流式生成
  @Sse('tokens')
  streamTokens(): Observable<MessageEvent> {
    return this.streamingService.streamTokens();
  }

  // 3. SSE 心跳
  @Sse('heartbeat')
  heartbeat(): Observable<MessageEvent> {
    return this.streamingService.streamHeartbeat();
  }

  // 4. 连接断开与资源清理
  @Sse('cleanup')
  cleanup(): Observable<MessageEvent> {
    return this.streamingService.streamCleanup();
  }

  // 5. 模拟执行失败
  @Sse('error')
  error(): Observable<MessageEvent> {
    return this.streamingService.streamError();
  }

  // 6. 异步初始化 Session
  @Sse('session')
  async session(
    @SseSignal() signal: AbortSignal,
  ): Promise<Observable<MessageEvent>> {
    // 模拟创建 AI Session
    const session = await this.createAiSession();

    // 初始化期间客户端可能已经断开
    if (signal.aborted) {
      await session.close();
      return EMPTY;
    }

    return new Observable<MessageEvent>(
      (subscriber) => {
        subscriber.next({
          type: 'started',
          data: {
            message: 'AI Session 初始化完成',
          },
        });

        const timer = setInterval(() => {
          subscriber.next({
            type: 'progress',
            data: {
              message: 'AI Session 正在运行',
            },
          });
        }, 1000);

        return () => {
          clearInterval(timer);
        };
      },
    ).pipe(
      finalize(() => {
        void session.close();
      }),
    );
  }

  private async createAiSession() {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    });

    return {
      async close() {
        console.log('AI Session 已释放');
      },
    };
  }
}
