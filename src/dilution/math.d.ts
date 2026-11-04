export type Step = { take: string; plus: string; sol: string };
export type Form = Step & {
  type: 'dry' | 'liq';
  amount: string;
  unit: string;
  vol: string;
  name: string;
  steps: Step[];
};
export type Row = {
  mg: string;
  ug: string;
  volume: string;
  summary: string;
  formula: string;
};
export function calc(f: Form): {
  errors: Record<string, string>;
  rows: Row[];
  warning: boolean;
};
