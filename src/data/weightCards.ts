export type WeightCardData = {
  weight: number;
  heartRate: string;
  systolicBloodPressure: string;
  bloodVolume: string;
  respiratoryRate: string;
  tidalVolume: string;
  laryngoscopeBlade: string;
  endotrachealTube: string;
};

export const weightCards: Record<number, WeightCardData> = {
  3: {
    weight: 3,
    heartRate: '110–160',
    systolicBloodPressure: '65–85',
    bloodVolume: '255',
    respiratoryRate: '35–55',
    tidalVolume: '21',
    laryngoscopeBlade: '0',
    endotrachealTube: '3,0',
  },
  4: {
    weight: 4,
    heartRate: '110–160',
    systolicBloodPressure: '65–85',
    bloodVolume: '340',
    respiratoryRate: '35–55',
    tidalVolume: '28',
    laryngoscopeBlade: '0',
    endotrachealTube: '3,0',
  },
  5: {
    weight: 5,
    heartRate: '110–160',
    systolicBloodPressure: '65–85',
    bloodVolume: '400',
    respiratoryRate: '35–55',
    tidalVolume: '35',
    laryngoscopeBlade: '0',
    endotrachealTube: '3,0',
  },
  6: {
    weight: 6,
    heartRate: '110–160',
    systolicBloodPressure: '70–90',
    bloodVolume: '480',
    respiratoryRate: '30–45',
    tidalVolume: '42',
    laryngoscopeBlade: '1',
    endotrachealTube: '3,0',
  },
  7: {
    weight: 7,
    heartRate: '110–160',
    systolicBloodPressure: '70–90',
    bloodVolume: '560',
    respiratoryRate: '30–45',
    tidalVolume: '49',
    laryngoscopeBlade: '1',
    endotrachealTube: '3,0',
  },
  8: {
    weight: 8,
    heartRate: '90–160',
    systolicBloodPressure: '90–100',
    bloodVolume: '640',
    respiratoryRate: '22–38',
    tidalVolume: '56',
    laryngoscopeBlade: '1',
    endotrachealTube: '3,0–3,5',
  },
  9: {
    weight: 9,
    heartRate: '90–160',
    systolicBloodPressure: '80–100',
    bloodVolume: '720',
    respiratoryRate: '22–38',
    tidalVolume: '63',
    laryngoscopeBlade: '1',
    endotrachealTube: '3,0–3,5',
  },
  10: {
    weight: 10,
    heartRate: '80–150',
    systolicBloodPressure: '80–105',
    bloodVolume: '800',
    respiratoryRate: '22–30',
    tidalVolume: '70',
    laryngoscopeBlade: '1',
    endotrachealTube: '3,5',
  },
};
