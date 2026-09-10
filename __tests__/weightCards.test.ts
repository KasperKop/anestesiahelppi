import { weightCards } from '@/src/data/weightCards';

describe('weightCards', () => {
  it('contains every populated source column from 3 to 10 kg', () => {
    expect(Object.keys(weightCards).map(Number)).toEqual([
      3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it('maps representative edge values to the correct weights', () => {
    expect(weightCards[3]).toMatchObject({
      bloodVolume: '255',
      tidalVolume: '21',
    });
    expect(weightCards[8]).toMatchObject({
      endotrachealTube: '3,0–3,5',
      respiratoryRate: '22–38',
    });
    expect(weightCards[10]).toMatchObject({
      heartRate: '80–150',
      systolicBloodPressure: '80–105',
      bloodVolume: '800',
    });
  });
});
