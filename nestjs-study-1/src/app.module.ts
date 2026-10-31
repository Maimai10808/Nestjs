import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module.js';
import { ProviderLabModule } from './provider-lab/provider-lab.module.js';

@Module({
  imports: [
    UsersModule,
    ProviderLabModule,
  ],
})
export class AppModule {}
