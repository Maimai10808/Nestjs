import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { TenantContextStrategy } from './tenant/tenant-context.strategy.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  ContextIdFactory.apply(new TenantContextStrategy());
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
