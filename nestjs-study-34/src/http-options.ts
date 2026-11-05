import { ConfigService } from '@nestjs/config';
import type { HttpModuleOptions } from '@nestjs/axios';

export function createHttpOptions(config: ConfigService): HttpModuleOptions {
  return {
    baseURL:
      config.get<string>('EXTERNAL_API_BASE_URL') ??
      `http://127.0.0.1:${config.get<string>('PORT') ?? '3000'}`,
    timeout: 5000,
    maxRedirects: 0,
  };
}
