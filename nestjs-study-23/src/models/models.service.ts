import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  CACHE_MANAGER,
  type Cache,
} from '@nestjs/cache-manager';

import { CacheKeys } from '../cache/cache-keys.js';

interface AiModel {
  id: string;
  provider: string;
}

@Injectable()
export class ModelsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<AiModel[]> {
    const key = CacheKeys.modelCatalog();

    // 第一步：读取缓存
    const cached = await this.cacheManager.get<AiModel[]>(
      key,
    );

    if (cached !== undefined && cached !== null) {
      console.log('[ModelsService] Cache Hit');

      return cached;
    }

    console.log('[ModelsService] Cache Miss');

    // 第二步：模拟查询外部模型目录
    const models = await this.fetchModels();

    // 第三步：写入缓存
    await this.cacheManager.set(
      key,
      models,
      60000,
    );

    return models;
  }

  private async fetchModels(): Promise<AiModel[]> {
    console.log('[ModelsService] 获取模型目录');

    // 模拟外部 API 请求耗时
    await new Promise((resolve) =>
      setTimeout(resolve, 1000),
    );

    return [
      {
        id: 'gpt-4.1',
        provider: 'openai',
      },
      {
        id: 'claude-sonnet',
        provider: 'anthropic',
      },
      {
        id: 'gpt-4.1-mini',
        provider: 'openai',
      },
    ];
  }
}
