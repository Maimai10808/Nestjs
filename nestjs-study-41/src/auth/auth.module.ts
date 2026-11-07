import { Module } from '@nestjs/common';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module.js';

import { SecurityModule } from '../security/security.module.js';

import { AuthController } from './auth.controller.js';

import { AuthService } from './auth.service.js';

import { AuthGuard } from './auth.guard.js';

@Module({
  imports: [
    UsersModule,

    SecurityModule,

    JwtModule.registerAsync({
      imports: [
        ConfigModule,
      ],

      inject: [
        ConfigService,
      ],

      useFactory: (
        configService: ConfigService,
      ) => {
        const secret =
          configService.get<string>(
            'JWT_SECRET',
          );

        if (
          !secret ||
          !/^[0-9a-fA-F]{64}$/.test(secret)
        ) {
          throw new Error(
            'JWT_SECRET 必须是 64 位十六进制随机字符串',
          );
        }

        return {
          secret,

          signOptions: {
            algorithm: 'HS256' as const,
            expiresIn: 3600,
          },

          verifyOptions: {
            algorithms: ['HS256' as const],
          },
        };
      },
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    AuthGuard,
  ],

  exports: [
    JwtModule,
    AuthService,
    AuthGuard,
  ],
})
export class AuthModule {}
