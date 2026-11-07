import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      instance: process.env.INSTANCE_ID ?? 'default',
      timestamp: new Date().toISOString(),
    };
  }
}
