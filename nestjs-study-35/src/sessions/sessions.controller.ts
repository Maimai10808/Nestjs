import {
  Controller,
  Get,
  Post,
  Body,
  Session,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import type { Request } from 'express';
import type { Session as ExpressSession } from 'express-session';

import { SessionGuard } from '../auth/session.guard.js';

@Controller('session')
@UseGuards(SessionGuard)
export class SessionsController {

  // 1. 查询当前 Session 信息
  @Get('info')
  getSessionInfo(
    @Session() session: ExpressSession,
  ) {
    return {
      userId: session.userId,
      loginAt: session.loginAt,
      sessionId: session.id,
    };
  }

  // 2. 查询用户偏好
  @Get('preferences')
  getPreferences(
    @Session() session: ExpressSession,
  ) {
    return {
      preferences: session.preferences ?? {
        theme: 'light',
        language: 'zh',
      },
    };
  }

  // 3. 修改用户偏好
  @Post('preferences')
  updatePreferences(
    @Session() session: ExpressSession,

    @Body()
    body: {
      theme: 'light' | 'dark';
      language: 'zh' | 'en';
    },
  ) {
    if (
      !['light', 'dark'].includes(body.theme) ||
      !['zh', 'en'].includes(body.language)
    ) {
      throw new BadRequestException(
        '无效的用户偏好配置',
      );
    }

    session.preferences = {
      theme: body.theme,
      language: body.language,
    };

    return {
      message: '用户偏好保存成功',
      preferences: session.preferences,
    };
  }

  // 4. 统计当前 Session 访问次数
  @Get('visits')
  getVisits(
    @Session() session: ExpressSession,
  ) {
    session.visits = (session.visits ?? 0) + 1;

    return {
      visits: session.visits,
    };
  }

  // 5. 重新生成 Session ID
  @Post('regenerate')
  async regenerate(
    @Req() request: Request,
  ) {
    const oldSession = request.session;

    const userId = oldSession.userId;
    const preferences = oldSession.preferences;
    const loginAt = oldSession.loginAt;

    if (userId === undefined) {
      throw new BadRequestException(
        '当前 Session 未登录',
      );
    }

    await new Promise<void>((resolve, reject) => {
      request.session.regenerate((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    // 恢复需要保留的业务数据
    request.session.userId = userId;
    request.session.preferences = preferences;
    request.session.loginAt = loginAt;

    await new Promise<void>((resolve, reject) => {
      request.session.save((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    return {
      message: 'Session ID 已重新生成',
      sessionId: request.session.id,
    };
  }
}
