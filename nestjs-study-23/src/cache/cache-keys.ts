export const CacheKeys = {
  // 公开 Agent 列表
  publicAgents: () => 'agents:public:list',

  // Agent 详情
  agentDetail: (agentId: number) =>
    `agents:detail:${agentId}`,

  // 用户个人 Agent 列表
  userAgents: (userId: number) =>
    `users:${userId}:agents`,

  // AI 模型目录
  modelCatalog: () => 'models:catalog',
};
