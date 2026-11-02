import { UsersService } from './users.service.js';

describe('UsersService', () => {
  it('删除后创建仍使用新ID，PUT移除可选字段且保留创建时间', () => {
    const users = new UsersService();
    const first = users.create({ name: 'Bob', email: 'bob@example.com', city: 'Beijing' });
    users.remove(first.id);
    const next = users.create({ name: 'Alice', email: 'alice2@example.com', city: 'Shanghai' });
    expect(next.id).toBeGreaterThan(first.id);
    const replacement = users.replace(next.id, { name: 'Robert', email: 'robert@example.com' });
    expect(replacement.createdAt).toBe(next.createdAt);
    expect(replacement.city).toBeUndefined();
  });
});
