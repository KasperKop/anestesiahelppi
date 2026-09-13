import { weightCards } from '@/src/data/weightCards';

describe('weightCards', () => {
  it('contains every selectable weight from 3 to 30 kg', () => {
    expect(Object.keys(weightCards).map(Number)).toEqual(
      Array.from({ length: 28 }, (_, index) => index + 3),
    );
  });

  it('keeps source-table boundary values assigned to the correct cards', () => {
    expect(weightCards[3]).toMatchObject({
      bloodVolume: '255',
      tidalVolume: '21',
      laryngoscopeBlade: '0',
    });
    expect(weightCards[13]).toMatchObject({
      bloodVolume: '975',
      endotrachealTube: '3,5',
      respiratoryRate: '22-30',
    });
    expect(weightCards[30]).toMatchObject({
      heartRate: '60-110',
      systolicBloodPressure: '100-120',
      bloodVolume: '2250',
      endotrachealTube: '5,0-5,5',
    });
  });

  it('uses Finnish medicine names and the corrected 3 kg atropine unit', () => {
    expect(weightCards[3].anaesthesiaMedications).toEqual([
      { name: 'Fentanyyli', value: '3 µg' },
      { name: 'Propofoli', value: '7-12 mg' },
      { name: 'Rokuroni', value: '3 mg' },
      { name: 'Suksametoni', value: '3-6 mg' },
      { name: 'Ondansetroni', value: '0,3 mg' },
      { name: 'Deksametasoni', value: '0,45 mg' },
    ]);
    expect(weightCards[3].emergencyValues).toContainEqual({
      name: 'Atropiini',
      value: '0,10 mg',
    });
  });

  it('calculates the documented 30 kg emergency values', () => {
    expect(weightCards[30].emergencyValues).toEqual([
      { name: 'Adrenaliini', value: '0,30 mg' },
      { name: 'Atropiini', value: '0,60 mg' },
      { name: 'Lidokaiini', value: '30 mg' },
      { name: 'Nestebolus', value: '300 ml' },
      { name: 'Amiodaroni', value: '150 mg' },
      { name: 'DC-kardioversio', value: '120 J' },
    ]);
  });
});
