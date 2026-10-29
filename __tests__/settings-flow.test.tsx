import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from '../src/settings/context';
import SettingsScreen from '../src/settings/SettingsScreen';
import { emptySettings } from '../src/settings/model';
import { readSettings, writeSettings } from '../src/settings/storage';
jest.mock('../src/settings/storage', () => ({
  readSettings: jest.fn(),
  writeSettings: jest.fn(),
}));
const read = jest.mocked(readSettings);
const write = jest.mocked(writeSettings);
function App() {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 320, height: 640 },
        insets: { top: 0, left: 0, right: 0, bottom: 34 },
      }}
    >
      <SettingsProvider>
        <SettingsScreen />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
beforeEach(() => {
  read.mockReset().mockResolvedValue(emptySettings());
  write.mockReset().mockResolvedValue();
});
it('saves, reloads and restores a custom dose', async () => {
  const view = await render(<App />);
  await fireEvent.press(await screen.findByLabelText('Muokkaa: Fentanyyli'));
  await fireEvent.changeText(
    screen.getByLabelText('Annos painokiloa kohti'),
    '0,8',
  );
  expect(screen.getByText('Painolla 15 kg: 12 µg')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('Tallenna'));
  await waitFor(() => expect(write).toHaveBeenCalledTimes(1));
  expect(screen.getByText('Muokattu')).toBeTruthy();
  const persisted = write.mock.calls[0][0];
  expect(persisted.overrides.fentanyl.dosePerKg).toBe(0.8);
  await view.unmount();
  read.mockResolvedValue(persisted);
  await render(<App />);
  await screen.findByText('Muokattu');
  await fireEvent.press(screen.getByLabelText('Palauta kaikki oletukset'));
  await fireEvent.press(screen.getByLabelText('Peruuta'));
  expect(write).toHaveBeenCalledTimes(1);
  await fireEvent.press(screen.getByLabelText('Palauta kaikki oletukset'));
  await fireEvent.press(screen.getByLabelText('Palauta oletukset'));
  await waitFor(() => expect(write).toHaveBeenLastCalledWith(emptySettings()));
  expect(screen.queryByText('Muokattu')).toBeNull();
});
it('requires confirmation after each significant edit and blocks invalid input', async () => {
  await render(<App />);
  await fireEvent.press(await screen.findByLabelText('Muokkaa: Fentanyyli'));
  const input = screen.getByLabelText('Annos painokiloa kohti');
  await fireEvent.changeText(input, '0');
  expect(screen.getByLabelText('Tallenna')).toBeDisabled();
  await fireEvent.changeText(input, '0,4');
  expect(screen.getByLabelText('Tallenna')).toBeDisabled();
  await fireEvent.press(screen.getByLabelText('Olen tarkistanut arvon'));
  expect(screen.getByLabelText('Tallenna')).not.toBeDisabled();
  await fireEvent.changeText(input, '0,3');
  expect(screen.getByLabelText('Tallenna')).toBeDisabled();
  expect(write).not.toHaveBeenCalled();
});
it('shows a storage failure and falls back to defaults', async () => {
  read.mockRejectedValueOnce(new Error('corrupt'));
  write.mockRejectedValueOnce(new Error('quota'));
  await render(<App />);
  await screen.findByText(
    'Asetuksia ei voitu lukea. Käytössä ovat oletusannokset.',
  );
  await fireEvent.press(screen.getByLabelText('Muokkaa: Fentanyyli'));
  await fireEvent.changeText(
    screen.getByLabelText('Annos painokiloa kohti'),
    '0,8',
  );
  await fireEvent.press(screen.getByLabelText('Tallenna'));
  await screen.findByText(/Asetusten tallennus epäonnistui/);
  await fireEvent.press(screen.getByLabelText('Takaisin asetuksiin'));
  expect(screen.queryByText('Muokattu')).toBeNull();
});
