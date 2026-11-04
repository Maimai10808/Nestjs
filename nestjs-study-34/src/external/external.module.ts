import { Module } from '@nestjs/common';
import { ExternalController } from './external.controller.js';

@Module({
  controllers: [ExternalController],
})
export class ExternalModule {}
