import data from './content.json';
export type Medication = {
  name: string;
  route: string;
  mode: string;
  group: string;
  value: string;
  unit: string;
  note: string;
  maximum?: { value: string; unit: string };
  dilution?: string;
};
export type EmergencyCard = Omit<(typeof data)[number], 'medications'> & {
  medications: Medication[];
};
export const emergencyCards: EmergencyCard[] = data;
