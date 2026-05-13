import { Config } from '../src/config.js';

describe('Config Singleton', () => {

  test('getInstance returns the same instance every time', () => {
    const a = Config.getInstance();
    const b = Config.getInstance();
    expect(a).toBe(b);
  });

  test('provinces contains all four required provinces', () => {
    const config = Config.getInstance();
    const names = config.provinces.map(p => p.name);
    expect(names).toContain('Madrid');
    expect(names).toContain('A Coruña');
    expect(names).toContain('Tenerife');
    expect(names).toContain('Badajoz');
  });

  test('products contains Gasolina 95 E5 and Gasoleo A habitual', () => {
    const config = Config.getInstance();
    const names = config.products.map(p => p.name);
    expect(names).toContain('Gasolina 95 E5');
    expect(names).toContain('Gasóleo A habitual');
  });

  test('Madrid province has correct ID', () => {
    const config = Config.getInstance();
    const madrid = config.provinces.find(p => p.name === 'Madrid');
    expect(madrid?.id).toBe('28');
  });

  test('Gasolina 95 E5 has correct product ID', () => {
    const config = Config.getInstance();
    const product = config.products.find(p => p.name === 'Gasolina 95 E5');
    expect(product?.id).toBe('1');
  });
});
