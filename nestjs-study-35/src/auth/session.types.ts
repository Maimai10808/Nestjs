import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;

    loginAt?: string;

    preferences?: {
      theme: 'light' | 'dark';
      language: 'zh' | 'en';
    };

    visits?: number;
  }
}
