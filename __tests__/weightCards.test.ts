import { weightCards } from '@/src/data/weightCards';

describe('weightCards', () => {
  it('contains the transcribed 4 kg prototype values', () => {
    expect(weightCards[4]).toEqual({
      weight: 4,
      heartRate: '110–160',
      systolicBloodPressure: '65–85',
      bloodVolume: '340',
      respiratoryRate: '35–55',
      tidalVolume: '28',
      laryngoscopeBlade: '0',
      endotrachealTube: '3,0',
    });
  });
});

