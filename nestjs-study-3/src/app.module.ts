import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ProductsModule } from './products/products.module.js';
import { ExceptionLabController } from './exception-lab/exception-lab.controller.js';
import { ExceptionLabService } from './exception-lab/exception-lab.service.js';
import { AllExceptionsFilter } from './exception-lab/filters/all-exceptions.filter.js';
import { HttpExceptionFilter } from './exception-lab/filters/http-exception.filter.js';

@Module({
  imports: [ProductsModule],
  controllers: [ExceptionLabController],
  providers: [
    ExceptionLabService,
    HttpExceptionFilter,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
