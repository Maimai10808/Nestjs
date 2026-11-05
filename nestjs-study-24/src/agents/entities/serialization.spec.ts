import { instanceToPlain } from 'class-transformer';
import { AgentEntity } from './agent.entity.js';
import { ModelEntity } from './model.entity.js';
import { UserEntity } from '../../users/entities/user.entity.js';

describe('实体的序列化规则', () => {
  it('从实例隐藏假秘密、转换模型并暴露计算属性', () => {
    const entity = new AgentEntity({
      id: 1,
      enabled: false,
      model: new ModelEntity({ name: 'gpt-4.1' }),
      apiKey: 'fake',
      systemPrompt: 'fake',
      totalCost: 10,
    });
    const plain = instanceToPlain(entity);
    expect(plain.model).toBe('gpt-4.1');
    expect(plain.status).toBe('disabled');
    expect(plain).not.toHaveProperty('apiKey');
    expect(plain).not.toHaveProperty('systemPrompt');
    expect(plain).not.toHaveProperty('totalCost');
    expect(entity.apiKey).toBe('fake');
  });
  it('用户 fullName 来自 getter，而密码字段只留在实例', () => {
    const user = new UserEntity({
      firstName: 'Alan',
      lastName: 'Turing',
      passwordHash: 'fake',
    });
    const plain = instanceToPlain(user);
    expect(plain.fullName).toBe('Alan Turing');
    expect(plain).not.toHaveProperty('passwordHash');
  });
});
