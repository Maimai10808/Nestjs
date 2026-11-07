import {
  Inject,
  Injectable,
  GatewayTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';

import {
  ClientProxy,
} from '@nestjs/microservices';

import {
  firstValueFrom,
  timeout,
  TimeoutError,
} from 'rxjs';

import {
  RESEARCH_PATTERNS,
  type ResearchRequest,
  type ResearchResult,
  type ResearchSubmittedEvent,
} from '@app/contracts';

@Injectable()
export class ResearchService {
  constructor(
    @Inject('AGENT_WORKER')
    private readonly client: ClientProxy,
  ) {}

  async analyze(
    request: ResearchRequest,
  ): Promise<ResearchResult> {
    try {
      return await firstValueFrom(
        this.client
          .send<ResearchResult>(
            RESEARCH_PATTERNS.ANALYZE,
            request,
          )
          .pipe(
            timeout(5000),
          ),
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new GatewayTimeoutException(
          'AI Worker 响应超时',
        );
      }

      throw new ServiceUnavailableException(
        'AI Worker 暂时不可用',
      );
    }
  }

  async getModels() {
    return firstValueFrom(
      this.client
        .send(
          RESEARCH_PATTERNS.MODELS,
          {},
        )
        .pipe(
          timeout(3000),
        ),
    );
  }

  async slow() {
    try {
      return await firstValueFrom(
        this.client
          .send(
            RESEARCH_PATTERNS.SLOW,
            {},
          )
          .pipe(
            timeout(2000),
          ),
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new GatewayTimeoutException(
          '远程 AI 任务超时',
        );
      }

      throw new ServiceUnavailableException(
        'AI Worker 不可用',
      );
    }
  }

  async submit(
    topic: string,
  ) {
    const event: ResearchSubmittedEvent = {
      taskId: crypto.randomUUID(),

      topic,

      submittedAt:
        new Date().toISOString(),
    };

    await firstValueFrom(
      this.client.emit(
        RESEARCH_PATTERNS.SUBMITTED,
        event,
      ),
    );

    return {
      message: '研究任务事件已发布',
      taskId: event.taskId,
    };
  }
}
