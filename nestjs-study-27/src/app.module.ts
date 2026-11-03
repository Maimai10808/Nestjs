import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { AgentsModule } from './agents/agents.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>(
            'REDIS_HOST',
            '127.0.0.1',
          ),

          port: Number(
            configService.get<string>(
              'REDIS_PORT',
              '6380',
            ),
          ),
        },
      }),
    }),

    AgentsModule,
  ],
})
export class AppModule {}
