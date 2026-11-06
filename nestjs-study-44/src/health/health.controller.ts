import {
  Controller,
  Get,
} from '@nestjs/common';

import {
  SkipThrottle,
} from '@nestjs/throttler';

@Controller('health')
@SkipThrottle({
  short: true,
  medium: true,
  long: true,
})
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
