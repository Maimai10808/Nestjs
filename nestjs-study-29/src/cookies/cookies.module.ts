import { Module } from '@nestjs/common';

import { CookiesController } from './cookies.controller.js';

@Module({
  controllers: [CookiesController],
})
export class CookiesModule {}
