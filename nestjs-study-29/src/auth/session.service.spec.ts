import { SessionService } from './session.service.js';

it('服务端 Session ID 随机且到期或删除后失效', () => {
  vi.useFakeTimers();
  try {
    const sessions = new SessionService();
    const first = sessions.createSession(1001);
    const second = sessions.createSession(1002);
    expect(first).not.toBe(second);
    expect(sessions.getSession(first)?.userId).toBe(1001);
    sessions.deleteSession(second);
    expect(sessions.getSession(second)).toBeNull();
    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(sessions.getSession(first)).toBeNull();
  } finally {
    vi.useRealTimers();
  }
});
