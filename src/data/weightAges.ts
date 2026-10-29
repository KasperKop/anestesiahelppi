/** Transcribed from the user-supplied 29 October 2026 video, not a growth standard.
 * Display-only context: never use this estimate in clinical calculations.
 */
const ages: Record<number, string> = {
  3: 'Vastasyntynyt',
  4: 'Noin 1 kk',
  5: 'Noin 2 kk',
  6: 'Noin 3 kk',
  7: 'Noin 4 kk',
  8: 'Noin 6 kk',
  9: 'Noin 9 kk',
  10: 'Noin 1 v',
  11: 'Noin 1 v',
  12: 'Noin 2 v',
  13: 'Noin 2 v',
  14: 'Noin 3 v',
  15: 'Noin 3 v',
  16: 'Noin 4 v',
  17: 'Noin 4 v',
  18: 'Noin 4 v',
  19: 'Noin 5 v',
  20: 'Noin 5 v',
  21: 'Noin 6 v',
  22: 'Noin 6 v',
  23: 'Noin 6 v',
  24: 'Noin 7 v',
  25: 'Noin 7 v',
  26: 'Noin 7 v',
  27: 'Noin 8 v',
  28: 'Noin 8 v',
  29: 'Noin 8 v',
  30: 'Noin 9 v',
};
export function weightAgeLabel(weight: number): string | undefined {
  return ages[weight];
}
