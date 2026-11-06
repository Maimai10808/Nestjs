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
      service: 'nestjs-study-42',
      timestamp: new Date().toISOString(),
    };
  }
}
