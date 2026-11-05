import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { AgentsModule } from './agents/agents.module.js';

@Module({
  imports: [
    AgentsModule,
  ],
  providers: [{
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  }],
})
export class AppModule {}
