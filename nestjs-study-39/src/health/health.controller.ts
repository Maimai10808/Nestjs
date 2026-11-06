import {
  Controller,
  Get,
} from '@nestjs/common';

import { Public } from '../auth/public.decorator.js';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'nestjs-study-39',
      timestamp: new Date().toISOString(),
    };
  }
}
