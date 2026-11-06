import { Module } from '@nestjs/common';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';

import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from '../users/users.module.js';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './auth.guard.js';

@Module({
  imports: [
    UsersModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const secret =
          configService.get<string>('JWT_SECRET');

        if (!secret || secret.length < 32) {
          throw new Error(
            'JWT_SECRET 必须配置为足够长的随机密钥',
          );
        }

        return {
          secret,

          signOptions: {
            expiresIn: 60,
            algorithm: 'HS256',
          },

          verifyOptions: {
            algorithms: ['HS256'],
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

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],

  exports: [
    AuthService,
  ],
})
export class AuthModule {}
