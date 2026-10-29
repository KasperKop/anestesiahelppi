import { decodeSettings, Settings } from './model';
export const SETTINGS_KEY = 'anestesiahelppi.settings.v1';
export async function readSettings() {
  return decodeSettings(
    typeof window === 'undefined'
      ? null
      : window.localStorage.getItem(SETTINGS_KEY),
  );
}
export async function writeSettings(settings: Settings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
