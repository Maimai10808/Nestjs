import { Injectable } from '@nestjs/common';

@Injectable()
export class PerformanceService {
  // 小型 JSON
  getSmallJson() {
    return {
      message: 'AI Agent API',
      status: 'ok',
      timestamp: Date.now(),
    };
  }

  // 大型 JSON
  getLargeJson() {
    const agents = Array.from(
      { length: 1000 },
      (_, index) => ({
        id: index + 1,
        name: `AI Agent ${index + 1}`,
        model: 'gpt-4.1',
        description:
          'This is an AI Agent for research and analysis.',
        enabled: true,
        metadata: {
          category: 'research',
          version: '1.0.0',
          capabilities: [
            'search',
            'analysis',
            'generation',
          ],
        },
      }),
    );

    return {
      total: agents.length,
      agents,
    };
  }

  // 当前运行环境信息
  getInfo(adapter: string) {
    return {
      adapter,
      nodeVersion: process.version,
      pid: process.pid,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
