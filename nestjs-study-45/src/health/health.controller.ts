import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'AI Coding Agent Gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
