import {
  Controller,
  Get,
} from '@nestjs/common';

import {
  SkipThrottle,
  Throttle,
} from '@nestjs/throttler';

@Controller('rate-limit')
export class RateLimitController {
  // 查询限流配置
  @Get('info')
  getInfo() {
    return {
      rules: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100,
        },
      ],
    };
  }

  // 严格限流演示
  @Get('test')
  @Throttle({
    short: {
      ttl: 1000,
      limit: 1,
    },
    medium: {
      ttl: 10000,
      limit: 3,
    },
    long: {
      ttl: 60000,
      limit: 5,
    },
  })
  test() {
    return {
      message: '请求成功',
      timestamp: Date.now(),
    };
  }

  // 跳过限流
  @Get('skip')
  @SkipThrottle({
    short: true,
    medium: true,
    long: true,
  })
  skip() {
    return {
      message: '当前接口跳过限流',
    };
  }
}
