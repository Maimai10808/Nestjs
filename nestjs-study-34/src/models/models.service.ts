import { Injectable, BadGatewayException, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';

export interface AiModel {
  id: string;
  provider: string;
  contextWindow: number;
}

@Injectable()
export class ModelsService {
  private readonly logger = new Logger(ModelsService.name);

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<AiModel[]> {
    this.logger.log('开始获取 AI 模型目录');

    try {
      const response =
        await this.httpService.axiosRef.get<AiModel[]>('/external/models');

      return response.data;
    } catch {
      throw new BadGatewayException('外部模型目录服务暂时不可用');
    }
  }
}
