import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EncryptionService } from '../security/encryption.service.js';

import type {
  AiProviderConfig,
  AiProviderPublic,
} from './provider.interface.js';

import type {
  CreateProviderDto,
} from './dto/create-provider.dto.js';

@Injectable()
export class ProvidersService {
  constructor(
    private readonly encryptionService:
      EncryptionService,
  ) {}

  private readonly providers:
    AiProviderConfig[] = [];

  private nextId = 1;

  // 1. 保存 API Key
  create(
    userId: number,
    dto: CreateProviderDto,
  ): AiProviderPublic {
    const encryptedApiKey =
      this.encryptionService.encrypt(
        dto.apiKey,
      );

    const provider: AiProviderConfig = {
      id: this.nextId++,
      userId,
      provider: dto.provider,
      encryptedApiKey,
      createdAt: new Date().toISOString(),
    };

    this.providers.push(provider);

    return this.toPublic(provider);
  }

  // 2. 查询当前用户的 Provider
  findAll(
    userId: number,
  ): AiProviderPublic[] {
    return this.providers
      .filter(
        (provider) =>
          provider.userId === userId,
      )
      .map((provider) =>
        this.toPublic(provider),
      );
  }

  // 3. 查询指定 Provider
  findOne(
    userId: number,
    id: number,
  ): AiProviderPublic {
    const provider = this.findOwned(
      userId,
      id,
    );

    return this.toPublic(provider);
  }

  // 4. 删除 Provider
  remove(
    userId: number,
    id: number,
  ) {
    const provider = this.findOwned(
      userId,
      id,
    );

    const index = this.providers.indexOf(
      provider,
    );

    this.providers.splice(index, 1);

    return {
      message: 'Provider 配置已删除',
    };
  }

  // 5. 供 Agent 业务使用的内部解密方法
  getDecryptedApiKey(
    userId: number,
    id: number,
  ): string {
    const provider = this.findOwned(
      userId,
      id,
    );

    return this.encryptionService.decrypt(
      provider.encryptedApiKey,
    );
  }

  private findOwned(
    userId: number,
    id: number,
  ): AiProviderConfig {
    const provider = this.providers.find(
      (item) => item.id === id,
    );

    if (!provider) {
      throw new NotFoundException(
        'Provider 不存在',
      );
    }

    if (provider.userId !== userId) {
      throw new ForbiddenException(
        '无权访问该 Provider',
      );
    }

    return provider;
  }

  private toPublic(
    provider: AiProviderConfig,
  ): AiProviderPublic {
    return {
      id: provider.id,
      provider: provider.provider,
      hasApiKey: true,
      createdAt: provider.createdAt,
    };
  }
}
