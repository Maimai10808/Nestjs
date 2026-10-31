import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

import { LoggerMiddleware } from '../common/middleware/logger.middleware.js';
import { RequestIdMiddleware } from '../common/middleware/request-id.middleware.js';
import { ApiKeyMiddleware } from '../common/middleware/api-key.middleware.js';
import { TimingMiddleware } from '../common/middleware/timing.middleware.js';

import { AuditService } from '../common/services/audit.service.js';

@Module({
  controllers: [ProductsController],

  providers: [
    ProductsService,
    AuditService,
  ],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. 所有商品接口都执行
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware, TimingMiddleware)
      .forRoutes(ProductsController);

    // 2. 只有 POST /products 需要 API Key
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes({
        path: 'products',
        method: RequestMethod.POST,
      });
  }
}
