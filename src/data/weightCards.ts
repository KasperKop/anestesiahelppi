export type MedicationValue = {
  name: string;
  value: string;
};

export type WeightCardData = {
  weight: number;
  heartRate: string;
  systolicBloodPressure: string;
  bloodVolume: string;
  respiratoryRate: string;
  tidalVolume: string;
  laryngoscopeBlade: string;
  endotrachealTube: string;
  anaesthesiaMedications: MedicationValue[];
  emergencyValues: MedicationValue[];
};

const weights = Array.from({ length: 28 }, (_, index) => index + 3);

const bloodVolumes = [
  255, 340, 400, 480, 560, 640, 720, 800, 850, 900, 975, 1050, 1125, 1200, 1275,
  1350, 1425, 1500, 1575, 1650, 1725, 1800, 1875, 1950, 2025, 2100, 2175, 2250,
];

const propofolValues = [
  '7-12',
  '10-14',
  '13-18',
  '15-21',
  '18-25',
  '20-28',
  '23-32',
  '25-35',
  '28-39',
  '30-42',
  '33-46',
  '35-49',
  '38-53',
  '40-56',
  '43-60',
  '45-63',
  '48-67',
  '50-70',
  '53-74',
  '55-77',
  '58-81',
  '60-80',
  '63-88',
  '65-91',
  '68-95',
  '70-98',
  '73-102',
  '75-105',
];

function valueByRange<T>(
  weight: number,
  ranges: [start: number, end: number, value: T][],
) {
  const match = ranges.find(([start, end]) => weight >= start && weight <= end);

  if (!match) {
    throw new Error(`Painolle ${weight} kg ei löytynyt lähdearvoa.`);
  }

  return match[2];
}

function decimalComma(value: number, decimals = 2, fixed = false) {
  const formatted = value.toFixed(decimals);
  const normalized = fixed
    ? formatted
    : formatted.replace(/0+$/, '').replace(/\.$/, '');

  return normalized.replace('.', ',');
}

function createCard(weight: number, index: number): WeightCardData {
  const laryngoscopeBlade = valueByRange(weight, [
    [3, 5, '0'],
    [6, 11, '1'],
    [12, 19, '1 tai 2'],
    [20, 26, '2'],
    [27, 30, '2 tai 3'],
  ]);
  const endotrachealTube = valueByRange(weight, [
    [3, 7, '3,0'],
    [8, 9, '3,0-3,5'],
    [10, 13, '3,5'],
    [14, 15, '3,5-4,0'],
    [16, 18, '4,0'],
    [19, 20, '4,0-4,5'],
    [21, 23, '4,5'],
    [24, 26, '4,5-5,0'],
    [27, 29, '5,0'],
    [30, 30, '5,0-5,5'],
  ]);
  const heartRate = valueByRange(weight, [
    [3, 7, '110-160'],
    [8, 9, '90-160'],
    [10, 13, '80-150'],
    [14, 20, '70-120'],
    [21, 30, '60-110'],
  ]);
  const systolicBloodPressure = valueByRange(weight, [
    [3, 5, '65-85'],
    [6, 7, '70-90'],
    [8, 8, '90-100'],
    [9, 9, '80-100'],
    [10, 10, '80-105'],
    [11, 13, '90-105'],
    [14, 15, '95-105'],
    [16, 20, '95-110'],
    [21, 30, '100-120'],
  ]);
  const respiratoryRate = valueByRange(weight, [
    [3, 5, '35-55'],
    [6, 7, '30-45'],
    [8, 9, '22-38'],
    [10, 13, '22-30'],
    [14, 20, '20-24'],
    [21, 30, '16-22'],
  ]);

  return {
    weight,
    heartRate,
    systolicBloodPressure,
    bloodVolume: String(bloodVolumes[index]),
    respiratoryRate,
    tidalVolume: String(weight * 7),
    laryngoscopeBlade,
    endotrachealTube,
    anaesthesiaMedications: [
      { name: 'Fentanyyli', value: `${weight} µg` },
      { name: 'Propofoli', value: `${propofolValues[index]} mg` },
      { name: 'Rokuroni', value: `${weight} mg` },
      { name: 'Suksametoni', value: `${weight}-${weight * 2} mg` },
      {
        name: 'Ondansetroni',
        value: `${decimalComma(weight / 10, 1)} mg`,
      },
      {
        name: 'Deksametasoni',
        value: `${decimalComma(weight * 0.15)} mg`,
      },
    ],
    emergencyValues: [
      {
        name: 'Adrenaliini',
        value: `${decimalComma(weight / 100, 2, true)} mg`,
      },
      {
        name: 'Atropiini',
        value:
          weight <= 5
            ? '0,10 mg'
            : `${decimalComma(weight * 0.02, 2, true)} mg`,
      },
      { name: 'Lidokaiini', value: `${weight} mg` },
      { name: 'Nestebolus', value: `${weight * 10} ml` },
      { name: 'Amiodaroni', value: `${weight * 5} mg` },
      { name: 'DC-kardioversio', value: `${weight * 4} J` },
    ],
  };
}

export const weightCards: Record<number, WeightCardData> = Object.fromEntries(
  weights.map((weight, index) => [weight, createCard(weight, index)]),
);
