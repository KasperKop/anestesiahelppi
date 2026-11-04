const parse = (s) => {
  s = String(s).trim().replace(',', '.');
  if (s.length > 40 || !/^\d+(\.\d+)?$/.test(s)) throw Error();
  const n = BigInt(s.replace('.', ''));
  if (!n) throw Error();
  return [n, 10n ** BigInt((s.split('.')[1] || '').length)];
};
const mul = (a, b) => [a[0] * b[0], a[1] * b[1]],
  div = (a, b) => mul(a, [b[1], b[0]]),
  add = (a, b) => [a[0] * b[1] + b[0] * a[1], a[1] * b[1]],
  gt = (a, b) => a[0] * b[1] > b[0] * a[1];
function fmt([n, d]) {
  let e = n.toString().length - d.toString().length;
  if (e >= 0 ? n < d * 10n ** BigInt(e) : n * 10n ** BigInt(-e) < d) e--;
  let k = 2 - e;
  if (k >= 0) n *= 10n ** BigInt(k);
  else d *= 10n ** BigInt(-k);
  let s = ((2n * n + d) / (2n * d)).toString();
  if (k <= 0) return s + '0'.repeat(-k);
  s = s.padStart(k + 1, '0');
  return (s.slice(0, -k) + ',' + s.slice(-k))
    .replace(/0+$/, '')
    .replace(/,$/, '');
}
function calc(f) {
  let errors = {},
    rows = [];
  function val(k, s) {
    try {
      return parse(s);
    } catch {
      errors[k] = 'Anna positiivinen luku yhdellä desimaalierottimella.';
      return [1n, 1n];
    }
  }
  const dry = f.type === 'dry',
    factor = { mg: [1n, 1n], g: [1000n, 1n], µg: [1n, 1000n] }[f.unit];
  if (!factor) errors.unit = 'Valitse yksikkö.';
  let base = mul(val('amount', f.amount), factor || [1n, 1n]),
    conc = base,
    vol,
    warning = false;
  function push(formula, summary) {
    rows.push({
      mg: fmt(conc) + ' mg/ml',
      ug: fmt(mul(conc, [1000n, 1n])) + ' µg/ml',
      volume: fmt(vol) + ' ml',
      formula,
      summary,
    });
  }
  function liquid(t, l, sol, k) {
    let take = val(k + 'take', t),
      plus = val(k + 'plus', l);
    if (vol && gt(take, vol))
      errors[k + 'take'] = 'Edellisessä vaiheessa ei ole näin paljon liuosta.';
    vol = add(take, plus);
    let old = conc;
    conc = div(mul(old, take), vol);
    warning ||= gt(div(vol, take), [10000n, 1n]);
    push(
      fmt(old) + ' mg/ml × ' + t + ' ml ÷ (' + t + ' ml + ' + l + ' ml)',
      t + ' ml liuosta (' + fmt(old) + ' mg/ml) + ' + l + ' ml ' + sol,
    );
  }
  if (dry) {
    vol = val('vol', f.vol);
    conc = div(base, vol);
    push(
      f.amount + ' ' + f.unit + ' ÷ ' + f.vol + ' ml',
      f.amount + ' ' + f.unit + ' kuiva-ainetta + ' + f.vol + ' ml ' + f.sol,
    );
  } else liquid(f.take, f.plus, f.sol, '');
  for (const [i, s] of f.steps.entries())
    liquid(s.take, s.plus, s.sol, 's' + i);
  if (!dry || f.steps.length)
    warning ||= gt(div(dry ? div(base, val('vol', f.vol)) : base, conc), [
      10000n,
      1n,
    ]);
  return { errors, rows: Object.keys(errors).length ? [] : rows, warning };
}
module.exports = { calc };
