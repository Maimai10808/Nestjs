import { CaslAbilityFactory } from './casl-ability.factory.js';
import { Action } from './action.enum.js';
import { Role } from './role.enum.js';
import { Agent } from '../agents/agent.entity.js';

describe('resource policy', () => {
  it('checks instances by ownership and gives running-delete denial priority', () => {
    const factory = new CaslAbilityFactory();
    const user = factory.createForUser({ id: 1001, role: Role.USER });
    const admin = factory.createForUser({ id: 1003, role: Role.ADMIN });
    const own = Object.assign(new Agent(), { ownerId: 1001, status: 'idle' });
    const other = Object.assign(new Agent(), { ownerId: 1002, status: 'idle' });
    const running = Object.assign(new Agent(), { ownerId: 1001, status: 'running' });
    expect(user.can(Action.Update, own)).toBe(true);
    expect(user.can(Action.Update, other)).toBe(false);
    expect(admin.can(Action.Update, other)).toBe(true);
    expect(user.can(Action.Delete, running)).toBe(false);
    expect(admin.can(Action.Delete, running)).toBe(false);
  });
});
