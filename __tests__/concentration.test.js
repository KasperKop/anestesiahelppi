const { test } = require('@jest/globals');
const assert = require('node:assert/strict');
const { calc, formatConcentration: fmt } = require('../src/dilution/math');
const cases = [
  ['0.05', '0,05 mg/ml (50 µg/ml)'],
  ['0.004', '0,004 mg/ml (4 µg/ml)'],
  ['0.02', '0,02 mg/ml (20 µg/ml)'],
  ['0.5', '0,5 mg/ml (500 µg/ml)'],
  ['1', '1 mg/ml'],
  ['25', '25 mg/ml'],
  ['100', '100 mg/ml'],
  ['1000', '1000 mg/ml'],
  [{ numerator: '1', denominator: '30' }, '≈ 0,0333 mg/ml (≈ 33,3 µg/ml)'],
];
for (const [v, s] of cases) test(s, () => assert.equal(fmt(v).text, s));
test('Warning below exact threshold only, no zero rounding', () => {
  assert.equal(fmt('0.00001').warning, '');
  assert.match(fmt('0.00000999').warning, /Erittäin/);
  assert.equal(fmt('0.00000000000001').mg, '0,00000000000001 mg/ml');
});
test('Unit threshold uses exact value, each approximation flagged', () =>
  assert.equal(fmt('0.9999').text, '≈ 1 mg/ml (≈ 1000 µg/ml)'));
test('Exact ratio survives JSON, chain uses unrounded values', () => {
  const rows = calc({
    type: 'dry',
    unit: 'mg',
    amount: '1',
    vol: '30',
    sol: 'Aqua',
    steps: [{ take: '1', plus: '2', sol: 'NaCl 0,9 %' }],
  }).rows;
  assert.equal(
    fmt(JSON.parse(JSON.stringify(rows[1].concentration))).text,
    '≈ 0,0111 mg/ml (≈ 11,1 µg/ml)',
  );
});
test('Prior calculation cases remain unchanged', () => {
  const base = {
    type: 'dry',
    unit: 'mg',
    amount: '2',
    vol: '40',
    sol: 'Aqua',
    steps: [],
  };
  for (const [f, out] of [
    [base, '0,05 mg/ml (50 µg/ml)'],
    [{ ...base, type: 'liq', amount: '25', take: '2', plus: '48' }, '1 mg/ml'],
    [
      {
        ...base,
        type: 'liq',
        unit: 'µg',
        amount: '100',
        take: '2',
        plus: '48',
      },
      '0,004 mg/ml (4 µg/ml)',
    ],
    [
      { ...base, vol: '10', steps: [{ take: '1', plus: '9', sol: 'Aqua' }] },
      '0,02 mg/ml (20 µg/ml)',
    ],
    [{ ...base, unit: 'g', amount: '1', vol: '100' }, '10 mg/ml'],
  ])
    assert.equal(calc(f).rows.at(-1).text, out);
});
test('Invalid input never produces result', () => {
  for (const vol of ['', '0', '-1', '1,2.3'])
    assert.equal(
      calc({
        type: 'dry',
        unit: 'mg',
        amount: '1',
        vol,
        sol: 'Aqua',
        steps: [],
      }).rows.length,
      0,
    );
});
