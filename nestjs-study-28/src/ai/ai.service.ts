import {
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly logger = new Logger(
    AiService.name,
  );

  async generate(
    agentId: number,
    input: string,
  ): Promise<string> {
    this.logger.log(
      `开始调用 AI 模型，agentId=${agentId}`,
    );

    this.logger.debug(
      `输入长度：${input.length}`,
    );

    // 模拟 AI API 调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1500);
    });

    this.logger.log(
      `AI 模型调用完成，agentId=${agentId}`,
    );

    return `Agent ${agentId} 已完成任务：${input}`;
  }
}
