import { APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';

import {
  ConfigModule,
  type ConfigType,
} from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from './config/database.config.js';

import { UsersModule } from './users/users.module.js';

import { AgentsModule } from './agents/agents.module.js';

import { TasksModule } from './tasks/tasks.module.js';

@Module({
  providers: [{
    provide: APP_PIPE,
    useValue: new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }),
  }],
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,

      envFilePath: '.env',

      load: [databaseConfig],
    }),

    // PostgreSQL 数据库
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],

      useFactory: (
        config: ConfigType<typeof databaseConfig>,
      ) => ({
        type: 'postgres',

        host: config.host,

        port: config.port,

        username: config.username,

        password: config.password,

        database: config.database,

        autoLoadEntities: true,

        // 仅限本地学习环境
        synchronize: true,
      }),
    }),

    // 业务模块
    UsersModule,

    AgentsModule,

    TasksModule,
  ],
})
export class AppModule {}
