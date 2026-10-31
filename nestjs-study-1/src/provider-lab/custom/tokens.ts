export const APP_CONFIG = Symbol('APP_CONFIG');

export interface AppConfig {
  appName: string;
  environment: string;
  version: string;
}
