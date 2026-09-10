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
};
