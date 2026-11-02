import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module.js';
import { ProviderLabModule } from './provider-lab/provider-lab.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [UsersModule, ProviderLabModule, OrdersModule],
  providers: [{
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  }],
})
export class AppModule {}
