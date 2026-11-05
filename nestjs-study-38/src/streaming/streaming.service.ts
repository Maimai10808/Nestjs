import {
  Injectable,
  Logger,
  type MessageEvent,
} from '@nestjs/common';

import {
  Observable,
  interval,
  map,
  take,
  concat,
  of,
  finalize,
} from 'rxjs';

import { AgentsService } from '../agents/agents.service.js';

@Injectable()
export class StreamingService {
  private readonly logger = new Logger(
    StreamingService.name,
  );

  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 1. Agent 执行阶段流
  streamResearch(): Observable<MessageEvent> {
    const stages =
      this.agentsService.getResearchStages();

    return interval(1000).pipe(
      take(stages.length),

      map((index): MessageEvent => {
        const stage = stages[index];

        return {
          id: String(index + 1),

          type:
            stage.stage === 'completed'
              ? 'completed'
              : 'progress',

          data: {
            stage: stage.stage,
            message: stage.message,
            progress:
              Math.round(
                ((index + 1) / stages.length) * 100,
              ),
            timestamp: new Date().toISOString(),
          },
        };
      }),

      finalize(() => {
        this.logger.log(
          'Agent Research SSE 流已结束',
        );
      }),
    );
  }

  // 2. 模拟 AI Token 流式生成
  streamTokens(): Observable<MessageEvent> {
    const tokens =
      this.agentsService.getResearchTokens();

    const tokenStream = interval(300).pipe(
      take(tokens.length),

      map((index): MessageEvent => ({
        id: String(index + 1),
        type: 'token',

        data: {
          token: tokens[index],
          index,
        },
      })),
    );

    const completedEvent: MessageEvent = {
      type: 'completed',

      data: {
        message: 'AI 文本生成完成',
        completedAt: new Date().toISOString(),
      },
    };

    return concat(
      tokenStream,
      of(completedEvent),
    );
  }

  // 3. SSE 心跳
  streamHeartbeat(): Observable<MessageEvent> {
    return interval(5000).pipe(
      map(
        (index): MessageEvent => ({
          type: 'heartbeat',

          data: {
            count: index + 1,
            timestamp: new Date().toISOString(),
          },
        }),
      ),

      finalize(() => {
        this.logger.log(
          'Heartbeat SSE 连接已结束',
        );
      }),
    );
  }

  // 4. 自定义 Observable：测试资源清理
  streamCleanup(): Observable<MessageEvent> {
    return new Observable<MessageEvent>(
      (subscriber) => {
        this.logger.log(
          '客户端建立 SSE 连接',
        );

        let count = 0;

        const timer = setInterval(() => {
          count++;

          subscriber.next({
            type: 'progress',

            data: {
              count,
              message: `正在执行第 ${count} 个步骤`,
            },
          });
        }, 1000);

        // Observable 取消订阅时执行
        return () => {
          clearInterval(timer);

          this.logger.log(
            '客户端连接结束，定时器已清理',
          );
        };
      },
    );
  }

  // 5. 模拟 AI 执行错误
  streamError(): Observable<MessageEvent> {
    return new Observable<MessageEvent>(
      (subscriber) => {
        subscriber.next({
          type: 'started',

          data: {
            message: 'AI Agent 开始执行',
          },
        });

        const timer = setTimeout(() => {
          subscriber.next({
            type: 'failed',

            data: {
              code: 'AI_MODEL_TIMEOUT',
              message: '模拟 AI 模型请求超时',
            },
          });

          subscriber.complete();
        }, 2000);

        return () => {
          clearTimeout(timer);
        };
      },
    );
  }
}
