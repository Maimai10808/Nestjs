import { createCache } from 'cache-manager';
import { CacheInvalidationService } from './cache-invalidation.service.js';

describe('修改一条 Agent 时保持其他用户和模型缓存', () => {
  it('定向失效三类键', async () => {
    const cache = createCache();
    for (const key of [
      'agents:public:list',
      'agents:detail:1',
      'users:1001:agents',
      'users:1002:agents',
      'models:catalog',
    ]) {
      await cache.set(key, ['cached'], 60000);
    }
    await new CacheInvalidationService(cache).invalidateAgent(1, 1001);
    expect(await cache.get('agents:public:list')).toBeUndefined();
    expect(await cache.get('agents:detail:1')).toBeUndefined();
    expect(await cache.get('users:1001:agents')).toBeUndefined();
    expect(await cache.get('users:1002:agents')).toEqual(['cached']);
    expect(await cache.get('models:catalog')).toEqual(['cached']);
    await cache.disconnect();
  });
});
