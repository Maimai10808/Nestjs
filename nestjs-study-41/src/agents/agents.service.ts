import {
  Injectable,
} from '@nestjs/common';

import { ProvidersService } from '../providers/providers.service.js';

@Injectable()
export class AgentsService {
  constructor(
    private readonly providersService:
      ProvidersService,
  ) {}

  async run(
    userId: number,
    providerId: number,
  ) {
    // 1. 获取解密后的 API Key
    const apiKey =
      this.providersService.getDecryptedApiKey(
        userId,
        providerId,
      );

    // 2. 模拟调用 AI API
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });

    // 3. 不返回原始 API Key
    return {
      message: 'AI Agent 执行成功',
      providerId,
      apiKeyAvailable: apiKey.length > 0,
      result:
        '已模拟使用用户配置的 AI API Key 调用模型',
    };
  }
}
