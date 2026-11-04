import { calc, type Form, type Row } from './math';
export const initial = (): Form => ({
  type: 'dry',
  name: '',
  amount: '',
  unit: '',
  vol: '',
  take: '',
  plus: '',
  sol: '',
  steps: [],
});
export function evaluate(f: Form) {
  const r = calc(f);
  if (!f.sol.trim()) r.errors.sol = 'Kirjoita liuottimen tai laimentimen nimi.';
  f.steps.forEach((s, i) => {
    if (!s.sol.trim()) r.errors['s' + i + 'sol'] = 'Kirjoita laimentimen nimi.';
  });
  if (f.steps.length > 4) r.errors.steps = 'Enintään viisi vaihetta.';
  if (Object.keys(r.errors).length) r.rows = [];
  return r;
}
export const lines = (rows: Row[]) =>
  rows
    .map((r) => r.summary + ' → ' + r.volume + ', ' + r.mg + ' (' + r.ug + ')')
    .join('\n');
