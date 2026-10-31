import { Inject, Injectable } from '@nestjs/common';

import {
  APP_CONFIG,
  type AppConfig,
} from './tokens.js';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(APP_CONFIG)
    private readonly config: AppConfig,
  ) {}

  getConfig(): AppConfig {
    return this.config;
  }
}
