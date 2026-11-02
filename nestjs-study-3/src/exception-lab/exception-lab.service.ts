import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';

@Injectable()
export class ExceptionLabService {
  private readonly agents = [
    { id: 1, name: 'Research Agent', status: 'active' },
    { id: 2, name: 'Coding Agent', status: 'active' },
  ];

  // 正常查询
  findAll() {
    return this.agents;
  }

  // 资源不存在：404
  findOne(id: number) {
    const agent = this.agents.find((item) => item.id === id);

    if (!agent) {
      throw new NotFoundException(`Agent ${id} 不存在`);
    }

    return agent;
  }

  // 资源冲突：409
  create(name: unknown) {
    if (typeof name !== 'string' || !name.trim()) {
      throw new BadRequestException('Agent 名称不能为空');
    }

    const normalizedName = name.trim();

    const exists = this.agents.some(
      (agent) => agent.name === normalizedName,
    );

    if (exists) {
      throw new ConflictException('Agent 名称已经存在');
    }

    const agent = {
      id: Math.max(0, ...this.agents.map((item) => item.id)) + 1,
      name: normalizedName,
      status: 'active',
    };

    this.agents.push(agent);

    return agent;
  }

  // 模拟模型服务不可用：503
  callLLM() {
    throw new ServiceUnavailableException(
      'OpenAI 模型服务暂时不可用',
    );
  }

  // 模拟未知异常：500
  simulateCrash() {
    throw new Error('数据库连接发生未知错误');
  }
}
