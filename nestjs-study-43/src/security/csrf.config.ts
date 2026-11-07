import { doubleCsrf } from 'csrf-csrf';
import type { Request } from 'express';

export function createCsrfProtection(
  secret: string,
) {
  if (secret.length < 32) throw new Error('CSRF_SECRET 配置无效');

  return doubleCsrf({
    getSecret: () => secret,

    getSessionIdentifier: (req: Request) => {
      return req.sessionID;
    },

    cookieName: 'agent.csrf',

    cookieOptions: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    },

    getCsrfTokenFromRequest: (req: Request) => {
      const token = req.headers['x-csrf-token'];
      return typeof token === 'string' ? token : undefined;
    },

    ignoredMethods: [
      'GET',
      'HEAD',
      'OPTIONS',
    ],
  });
}
