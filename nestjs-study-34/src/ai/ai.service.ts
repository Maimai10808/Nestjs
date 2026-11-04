import {
  Injectable,
  Logger,
  BadGatewayException,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';

import { AxiosError } from 'axios';

interface AiGenerateResponse {
  model: string;
  output: string;
  tokensUsed: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(
    AiService.name,
  );

  constructor(
    private readonly httpService: HttpService,
  ) {}

  async generate(
    prompt: string,
  ): Promise<AiGenerateResponse> {
    this.logger.log('开始调用外部 AI API');

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<AiGenerateResponse>(
          'http://127.0.0.1:3000/external/ai/generate',
          {
            prompt,
          },
        ),
      );

      this.logger.log(
        `AI 生成完成，tokensUsed=${data.tokensUsed}`,
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `AI API 请求失败：${error.message}`,
        );
      }

      throw new BadGatewayException(
        'AI 模型服务调用失败',
      );
    }
  }
}
