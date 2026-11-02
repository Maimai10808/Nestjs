export interface AiModuleOptions {
  // 选择 AI 提供商
  provider: 'openai' | 'claude';

  // 教学配置：仅演示配置注入，当前 Mock 不执行超时控制；单位毫秒
  timeout: number;

  // 教学配置：当前 Mock 不执行重试
  maxRetries: number;
}
