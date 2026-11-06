import { doubleCsrf } from 'csrf-csrf';
import type { Request } from 'express';

export function createCsrfProtection(
  secret: string,
) {
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
      return req.headers['x-csrf-token'] as
        | string
        | undefined;
    },

    ignoredMethods: [
      'GET',
      'HEAD',
      'OPTIONS',
    ],
  });
}
