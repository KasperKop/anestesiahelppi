import { fireEvent, render } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import ResuscitationScreen from '../app/resuscitation';
jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
}));
describe('Elvytys', () => {
  it('keeps age-specific instructions separate and resets sources when switching', async () => {
    const screen = await render(<ResuscitationScreen />);
    expect(screen.getByText('Lasten hoitoelvytys')).toBeOnTheScreen();
    await fireEvent.press(
      screen.getByRole('button', { name: /Näytä alkuperäinen/ }),
    );
    expect(screen.getByText(/Ei ERC:n hyväksymä käännös/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('tab', { name: 'Vastasyntynyt' }));
    expect(screen.getByText('Vastasyntyneen elvytys')).toBeOnTheScreen();
    expect(
      screen.getByText(/Varmista ensin vähintään 30 sekuntia/),
    ).toBeOnTheScreen();
    expect(screen.queryByText('Defibrilloitava')).toBeNull();
    expect(screen.queryByText(/Ei ERC:n hyväksymä käännös/)).toBeNull();
    await fireEvent.press(screen.getByRole('tab', { name: 'Aikuiset' }));
    expect(screen.getByText('Aikuisen hoitoelvytys')).toBeOnTheScreen();
    expect(
      screen.getByText(/Adrenaliini 1 mg, toista 3–5 min/),
    ).toBeOnTheScreen();
    expect(screen.queryByText(/Adrenaliini 10 µg\/kg/)).toBeNull();
  });
  it('opens the selected source only on request and supports direct-entry return', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    const screen = await render(<ResuscitationScreen />);
    expect(open).not.toHaveBeenCalled();
    await fireEvent.press(
      screen.getByRole('button', { name: /Näytä alkuperäinen/ }),
    );
    await fireEvent.press(
      screen.getByRole('link', { name: /Avaa tämän ikäryhmän/ }),
    );
    expect(open).toHaveBeenCalledWith(
      'https://www.erc.edu/media/03xnpjmj/gl2025-09-pls-e.pdf',
    );
    await fireEvent.press(
      screen.getByRole('button', { name: 'Takaisin etusivulle' }),
    );
    expect(router.replace).toHaveBeenCalledWith('/');
    open.mockRestore();
  });
});
