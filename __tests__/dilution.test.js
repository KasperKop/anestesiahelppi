const { test, expect } = require('@jest/globals');
const { calc } = require('../src/dilution/math');
const f = {
  type: 'dry',
  unit: 'mg',
  amount: '2',
  vol: '40',
  sol: 'NaCl',
  steps: [],
};
test.each([
  [{}, '0,05', '50', '40'],
  [{ type: 'liq', amount: '25', take: '2', plus: '48' }, '1', '1000', '50'],
  [
    { type: 'liq', unit: 'µg', amount: '100', take: '2', plus: '48' },
    '0,004',
    '4',
    '50',
  ],
  [
    { vol: '10', steps: [{ take: '1', plus: '9', sol: 'NaCl' }] },
    '0,02',
    '20',
    '10',
  ],
  [{ amount: '1', unit: 'g', vol: '100' }, '10', '10000', '100'],
  [
    { type: 'liq', amount: '1', take: '0,1', plus: '0.2' },
    '0,333',
    '333',
    '0,3',
  ],
])('laskenta %j', (x, a, b, v) =>
  expect(calc({ ...f, ...x }).rows.at(-1)).toMatchObject({
    mg: a + ' mg/ml',
    ug: b + ' µg/ml',
    volume: v + ' ml',
  }),
);
test.each(['', '0', '-1', '1,2.3', 'abc'])('virhe %j', (vol) =>
  expect(calc({ ...f, vol }).rows).toEqual([]),
);

test('structured dilution survives reload and updates the same card beside personal notes', () => {
  const {
    emptyMemory,
    changeMemory,
    decodeMemory,
  } = require('../src/memory/model');
  let m = changeMemory(emptyMemory(), {
    type: 'saveNote',
    id: 'note',
    text: 'Oma teksti',
  });
  const form = {
    type: 'dry',
    amount: '2',
    unit: 'mg',
    vol: '10',
    take: '',
    plus: '',
    name: 'Malli',
    sol: 'Vesi',
    steps: [{ take: '1', plus: '9', sol: 'Glucos 10 %' }],
  };
  m = changeMemory(m, { type: 'saveDilution', id: 'd', form, edit: false });
  const old = m.cards[1];
  m = decodeMemory(JSON.stringify(m));
  expect(m.cards[1].dilution.form).toEqual(form);
  expect(m.cards[1].dilution.rows[1].ug).toBe('20 µg/ml');
  m = changeMemory(m, {
    type: 'saveDilution',
    id: 'd',
    form: { ...form, name: 'Muokattu' },
    edit: true,
  });
  expect(m.cards).toHaveLength(2);
  expect(m.stacks).toHaveLength(2);
  expect(m.cards[1].savedAt).toBe(old.savedAt);
  expect(m.cards[0].answer.body).toBe('Oma teksti');
});
