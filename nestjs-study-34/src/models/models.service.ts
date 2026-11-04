import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';

interface AiModel {
  id: string;
  provider: string;
  contextWindow: number;
}

@Injectable()
export class ModelsService {
  private readonly logger = new Logger(
    ModelsService.name,
  );

  constructor(
    private readonly httpService: HttpService,
  ) {}

  async findAll(): Promise<AiModel[]> {
    this.logger.log('开始获取 AI 模型目录');

    const response =
      await this.httpService.axiosRef.get<AiModel[]>(
        'http://127.0.0.1:3000/external/models',
      );

    return response.data;
  }
}
