import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import type { ConfigType } from '@nestjs/config';

import quotaConfig from '../config/quota.config.js';

@Injectable()
export class QuotaService {
  constructor(
    @Inject(quotaConfig.KEY)
    private readonly config: ConfigType<typeof quotaConfig>,
  ) {}

  // 获取用户配额配置
  getConfig() {
    return {
      dailyLimit: this.config.dailyLimit,

      maxTokensPerRequest:
        this.config.maxTokensPerRequest,
    };
  }

  // 模拟用户配额检查
  checkQuota(usedToday: number) {
    if (!Number.isSafeInteger(usedToday) || usedToday < 0) {
      throw new BadRequestException('usedToday 必须是非负安全整数');
    }
    const remaining = Math.max(
      0,
      this.config.dailyLimit - usedToday,
    );

    return {
      dailyLimit: this.config.dailyLimit,

      usedToday,

      remaining,

      allowed: remaining > 0,
    };
  }
}
