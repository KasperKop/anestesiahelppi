import {
  calculateDose,
  decodeSettings,
  defaultValue,
  drugs,
  emptySettings,
  parseDose,
  resolveDrug,
  significantDeviation,
} from '../src/settings/model';
import { weightCards } from '../src/data/weightCards';
const fentanyl = drugs[0];
const propofol = drugs[1];
const range = drugs[3];
describe('dose settings', () => {
  it('preserves every original medicine value at all 28 weights', () => {
    for (let weight = 3; weight <= 30; weight++) {
      expect(
        drugs.map((drug) => ({
          name: drug.name,
          value: resolveDrug(drug, weight, {}).value,
        })),
      ).toEqual(weightCards[weight].anaesthesiaMedications);
    }
  });
  it('applies one override to every weight without mutating the defaults', () => {
    const before = JSON.stringify(weightCards);
    const overrides = {
      fentanyl: { dosePerKg: 0.8, modifiedAt: '2026-10-29' },
    };
    expect(resolveDrug(fentanyl, 10, overrides).value).toBe('8 µg');
    expect(resolveDrug(fentanyl, 25, overrides).value).toBe('20 µg');
    for (let weight = 3; weight <= 30; weight++)
      expect(resolveDrug(fentanyl, weight, overrides).modified).toBe(true);
    expect(JSON.stringify(weightCards)).toBe(before);
    expect(resolveDrug(fentanyl, 25, {}).value).toBe('25 µg');
  });
  it('accepts Finnish decimal comma and rejects malformed or unsafe values', () => {
    expect(parseDose(fentanyl, '0,8', '')).toEqual({ dosePerKg: 0.8 });
    for (const value of [
      '',
      '0',
      '-1',
      'abc',
      '1e2',
      'Infinity',
      '0.001',
      '1,2,3',
      '9999999999999999',
    ])
      expect(parseDose(fentanyl, value, '')).toBeUndefined();
    expect(parseDose(range, '2', '1')).toBeUndefined();
    expect(parseDose(range, '1', '')).toBeUndefined();
    expect(parseDose(range, '1,25', '2')).toEqual({
      dosePerKg: 1.25,
      maxDosePerKg: 2,
    });
  });
  it('compares both range endpoints and every original propofol table row', () => {
    expect(significantDeviation(fentanyl, { dosePerKg: 0.5 })).toBe(false);
    expect(significantDeviation(fentanyl, { dosePerKg: 0.49 })).toBe(true);
    expect(significantDeviation(fentanyl, { dosePerKg: 1.5 })).toBe(false);
    expect(significantDeviation(fentanyl, { dosePerKg: 1.51 })).toBe(true);
    expect(
      significantDeviation(range, { dosePerKg: 1, maxDosePerKg: 3.01 }),
    ).toBe(true);
    expect(
      significantDeviation(propofol, { dosePerKg: 2.5, maxDosePerKg: 3.5 }),
    ).toBe(false);
    expect(
      significantDeviation(propofol, { dosePerKg: 1, maxDosePerKg: 3.5 }),
    ).toBe(true);
    expect(defaultValue(propofol, 24)).toBe('60-80 mg');
    expect(
      resolveDrug(propofol, 24, {
        propofol: { dosePerKg: 2, maxDosePerKg: 3, modifiedAt: '2026-10-29' },
      }).value,
    ).toBe('48–72 mg');
  });
  it('supports a new medicine and minimum dose through the same calculation', () => {
    const example = {
      ...fentanyl,
      id: 'test-only',
      name: 'Testilääke',
      minimumDose: 2,
      defaultDose: { dosePerKg: 0.1 },
    };
    expect(calculateDose(example, 3, { dosePerKg: 0.1 })).toBe('2 µg');
    expect(resolveDrug(example, 30, {}).value).toBe('3 µg');
  });
  it('preserves medicine-specific rounding', () => {
    expect(calculateDose(drugs[4], 3, { dosePerKg: 0.15 })).toBe('0,4 mg');
    expect(calculateDose(drugs[5], 3, { dosePerKg: 0.15 })).toBe('0,45 mg');
  });
  it('decodes persistence safely, ignoring removed IDs and redundant overrides', () => {
    expect(decodeSettings(null)).toEqual(emptySettings());
    expect(
      decodeSettings(
        JSON.stringify({ version: 1, overrides: { removed: 'bad' } }),
      ),
    ).toEqual(emptySettings());
    expect(
      decodeSettings(
        JSON.stringify({
          version: 1,
          overrides: { fentanyl: { dosePerKg: 1, modifiedAt: '2026-10-29' } },
        }),
      ),
    ).toEqual(emptySettings());
    for (const payload of [
      '{',
      '{}',
      '{"version":2,"overrides":{}}',
      '{"version":1,"overrides":[]}',
      JSON.stringify({
        version: 1,
        overrides: { fentanyl: { dosePerKg: -1, modifiedAt: '2026-10-29' } },
      }),
    ])
      expect(() => decodeSettings(payload)).toThrow();
    const settings = {
      version: 1,
      overrides: { fentanyl: { dosePerKg: 0.8, modifiedAt: '2026-10-29' } },
    };
    expect(decodeSettings(JSON.stringify(settings))).toEqual(settings);
  });
});
