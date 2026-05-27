import { Config } from '../src/config.js';

describe('Config Singleton', () => {

  test('getInstance returns the same instance every time', () => {
    const a = Config.getInstance();
    const b = Config.getInstance();
    expect(a).toBe(b);
  });
});
