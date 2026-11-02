import {
  Injectable,
  Inject,
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
