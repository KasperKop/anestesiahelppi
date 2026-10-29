import { weightCards } from '../data/weightCards';

export type Dose = { dosePerKg: number; maxDosePerKg?: number };
export type Drug = {
  id: string;
  name: string;
  unit: 'mg' | 'µg';
  decimals: number;
  defaultDose: Dose | 'table';
  minimumDose?: number;
};
// Add a stable id and dose here to make a new medicine available in settings
// and all weight cards. Existing source-table values remain authoritative.
export const drugs: Drug[] = [
  {
    id: 'fentanyl',
    name: 'Fentanyyli',
    unit: 'µg',
    decimals: 2,
    defaultDose: { dosePerKg: 1 },
  },
  {
    id: 'propofol',
    name: 'Propofoli',
    unit: 'mg',
    decimals: 2,
    defaultDose: 'table',
  },
  {
    id: 'rocuronium',
    name: 'Rokuroni',
    unit: 'mg',
    decimals: 2,
    defaultDose: { dosePerKg: 1 },
  },
  {
    id: 'suxamethonium',
    name: 'Suksametoni',
    unit: 'mg',
    decimals: 2,
    defaultDose: { dosePerKg: 1, maxDosePerKg: 2 },
  },
  {
    id: 'ondansetron',
    name: 'Ondansetroni',
    unit: 'mg',
    decimals: 1,
    defaultDose: { dosePerKg: 0.1 },
  },
  {
    id: 'dexamethasone',
    name: 'Deksametasoni',
    unit: 'mg',
    decimals: 2,
    defaultDose: { dosePerKg: 0.15 },
  },
];
export type Override = Dose & { modifiedAt: string };
export type Settings = { version: 1; overrides: Record<string, Override> };
export const emptySettings = (): Settings => ({ version: 1, overrides: {} });
export const isRange = (drug: Drug) =>
  drug.defaultDose === 'table' || drug.defaultDose.maxDosePerKg !== undefined;
export function formatNumber(value: number, decimals = 2) {
  return Number(value.toFixed(decimals)).toString().replace('.', ',');
}
export function doseLabel(dose: Dose, unit: string) {
  return `${formatNumber(dose.dosePerKg)}${dose.maxDosePerKg === undefined ? '' : `–${formatNumber(dose.maxDosePerKg)}`} ${unit}/kg`;
}
export function validDose(drug: Drug, value: Dose) {
  const valid = (n: unknown): n is number =>
    typeof n === 'number' &&
    Number.isFinite(n) &&
    n > 0 &&
    n <= Number.MAX_SAFE_INTEGER / 3000 &&
    Math.abs(n * 100 - Math.round(n * 100)) < 0.000001;
  return (
    valid(value.dosePerKg) &&
    (isRange(drug)
      ? valid(value.maxDosePerKg) && value.maxDosePerKg >= value.dosePerKg
      : value.maxDosePerKg === undefined)
  );
}
export function parseDose(
  drug: Drug,
  low: string,
  high: string,
): Dose | undefined {
  const parse = (v: string) =>
    /^\d+(?:[.,]\d{1,2})?$/.test(v.trim())
      ? Number(v.trim().replace(',', '.'))
      : NaN;
  const dose: Dose = {
    dosePerKg: parse(low),
    ...(isRange(drug) ? { maxDosePerKg: parse(high) } : {}),
  };
  return validDose(drug, dose) ? dose : undefined;
}
export function calculateDose(drug: Drug, weight: number, dose: Dose) {
  const amount = (perKg: number) =>
    formatNumber(
      Math.max(drug.minimumDose ?? 0, weight * perKg),
      drug.decimals,
    );
  return `${amount(dose.dosePerKg)}${dose.maxDosePerKg === undefined ? '' : `–${amount(dose.maxDosePerKg)}`} ${drug.unit}`;
}
export function defaultValue(drug: Drug, weight: number): string {
  const original = weightCards[weight]?.anaesthesiaMedications.find(
    (row) => row.name === drug.name,
  );
  if (original) return original.value;
  if (drug.defaultDose === 'table')
    throw new Error('Lääkkeen oletustaulukko puuttuu.');
  return calculateDose(drug, weight, drug.defaultDose);
}
export function resolveDrug(
  drug: Drug,
  weight: number,
  overrides: Settings['overrides'],
) {
  const override = overrides[drug.id];
  const modified = !!override && validDose(drug, override);
  return {
    id: drug.id,
    name: drug.name,
    value: modified
      ? calculateDose(drug, weight, override)
      : defaultValue(drug, weight),
    defaultValue: defaultValue(drug, weight),
    modified,
  };
}
export function significantDeviation(drug: Drug, dose: Dose) {
  // A table has no single per-kg default. Compare corresponding endpoints
  // against EVERY original selectable weight, rather than guessing a formula.
  return Object.keys(weightCards).some((key) => {
    const weight = Number(key);
    const baseline =
      drug.defaultDose === 'table'
        ? defaultValue(drug, weight)
            .replace(` ${drug.unit}`, '')
            .split(/[-–]/)
            .map((v) => Number(v.replace(',', '.')) / weight)
        : [
            drug.defaultDose.dosePerKg,
            drug.defaultDose.maxDosePerKg ?? drug.defaultDose.dosePerKg,
          ];
    return [dose.dosePerKg, dose.maxDosePerKg ?? dose.dosePerKg].some(
      (n, i) => Math.abs(n - baseline[i]) / baseline[i] > 0.5 + Number.EPSILON,
    );
  });
}
export function sameAsDefault(drug: Drug, dose: Dose) {
  return (
    drug.defaultDose !== 'table' &&
    dose.dosePerKg === drug.defaultDose.dosePerKg &&
    dose.maxDosePerKg === drug.defaultDose.maxDosePerKg
  );
}
export function decodeSettings(raw: string | null): Settings {
  if (raw === null) return emptySettings();
  const parsed = JSON.parse(raw);
  if (
    parsed?.version !== 1 ||
    !parsed.overrides ||
    typeof parsed.overrides !== 'object' ||
    Array.isArray(parsed.overrides)
  )
    throw new Error('Virheelliset asetukset');
  const result = emptySettings();
  for (const drug of drugs) {
    if (!Object.hasOwn(parsed.overrides, drug.id)) continue;
    const value = parsed.overrides[drug.id];
    if (
      !value ||
      !validDose(drug, value) ||
      typeof value.modifiedAt !== 'string' ||
      !Number.isFinite(Date.parse(value.modifiedAt))
    )
      throw new Error('Virheellinen annos');
    if (!sameAsDefault(drug, value))
      result.overrides[drug.id] = {
        dosePerKg: value.dosePerKg,
        ...(isRange(drug) ? { maxDosePerKg: value.maxDosePerKg } : {}),
        modifiedAt: value.modifiedAt,
      };
  }
  return result;
}
