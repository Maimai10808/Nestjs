export interface AiModuleOptions {
  // 选择 AI 提供商
  provider: 'openai' | 'claude';

  // 请求超时时间，单位毫秒
  timeout: number;

  // 最大重试次数
  maxRetries: number;
}
