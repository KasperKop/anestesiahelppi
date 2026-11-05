export type Step = { take: string; plus: string; sol: string };
export type Form = Step & {
  type: 'dry' | 'liq';
  amount: string;
  unit: string;
  vol: string;
  name: string;
  steps: Step[];
};
export type ExactConcentration = { numerator: string; denominator: string };
export function formatConcentration(value: ExactConcentration | string): {
  mg: string;
  ug: string;
  text: string;
  warning: string;
};
export type Row = {
  concentration: ExactConcentration;
  text: string;
  warning: string;
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
