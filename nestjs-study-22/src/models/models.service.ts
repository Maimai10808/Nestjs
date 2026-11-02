import { Inject, Injectable } from '@nestjs/common';

import {
  CACHE_MANAGER,
  type Cache,
} from '@nestjs/cache-manager';

interface AiModel {
  id: string;
  provider: string;
  contextWindow: number;
}

@Injectable()
export class ModelsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<AiModel[]> {
    // 1. 定义缓存 Key
    const cacheKey = 'ai:models:all';

    // 2. 尝试读取缓存
    const cached =
      await this.cacheManager.get<AiModel[]>(cacheKey);

    // 3. 缓存命中
    if (cached !== undefined && cached !== null) {
      console.log('[ModelsService] 缓存命中');

      return cached;
    }

    // 4. 缓存未命中
    console.log('[ModelsService] 缓存未命中，获取模型目录');

    // 模拟外部 API 请求
    const models = await this.fetchModels();

    // 5. 写入缓存，TTL 为 60 秒
    await this.cacheManager.set(
      cacheKey,
      models,
      60_000,
    );

    // 6. 返回结果
    return models;
  }

  private async fetchModels(): Promise<AiModel[]> {
    // 模拟外部 API 需要 500ms
    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    return [
      {
        id: 'gpt-4.1',
        provider: 'openai',
        contextWindow: 1047576,
      },
      {
        id: 'claude-sonnet',
        provider: 'anthropic',
        contextWindow: 200000,
      },
      {
        id: 'gpt-4.1-mini',
        provider: 'openai',
        contextWindow: 1047576,
      },
    ];
  }
}
