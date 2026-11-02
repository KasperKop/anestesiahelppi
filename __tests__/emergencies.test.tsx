import { CardContents } from '../src/emergencies/CardContents';
import { fireEvent, render } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import EmergenciesScreen, { referenceUrl } from '../app/emergencies';
import HomeScreen from '../app/(tabs)/index';
import { emergencyCards } from '../src/emergencies/cards';

jest.mock('../src/settings/context', () => ({
  useSettings: () => ({ weight: 15, setWeight: jest.fn() }),
}));

jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn() },
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
}));
jest.mock('../src/components/WeightSelector', () => ({
  WeightSelector: () => null,
}));
jest.mock('../src/chat/ChatPanel', () => ({ ChatPanel: () => null }));

describe('Hätätilannekortit', () => {
  it('offers sibling home destinations', async () => {
    const screen = await render(<HomeScreen />);
    await fireEvent.press(
      screen.getByRole('button', { name: /^Hätätilanteet$/ }),
    );
    expect(router.push).toHaveBeenCalledWith('/emergencies');
    await fireEvent.press(screen.getByRole('button', { name: /^Elvytys$/ }));
    expect(router.push).toHaveBeenCalledWith('/resuscitation');
  });
  it('has 12 unique source cards without local contact details', () => {
    expect(emergencyCards).toHaveLength(12);
    expect(new Set(emergencyCards.map((c) => c.id)).size).toBe(12);
    emergencyCards.forEach((card, i) => {
      expect(card.steps.length).toBeGreaterThan(0);
      if (i === 0) {
        expect(card.steps).toHaveLength(10);
        expect(card.medications).toContainEqual(
          expect.objectContaining({
            group: 'Infuusionopeus',
            value: '5–20',
            unit: 'ml/h',
          }),
        );
      }

      expect(card.date).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
      expect(JSON.stringify(card)).not.toMatch(
        /044\d{7}|2222|keskuslääke|pehmo-aistin|\bNesy\b/i,
      );
    });
  });
  it('jumps from the adrenaline step to the measured medication section', async () => {
    const onJump = jest.fn();
    const screen = await render(
      <CardContents card={emergencyCards[0]} onJump={onJump} />,
    );
    await fireEvent(screen.getByTestId('emergency-body'), 'layout', {
      nativeEvent: { layout: { y: 78 } },
    });
    await fireEvent(screen.getByTestId('emergency-medication'), 'layout', {
      nativeEvent: { layout: { y: 691 } },
    });
    await fireEvent.press(
      screen.getByRole('button', { name: 'Siirry annoksiin' }),
    );
    expect(onJump).toHaveBeenCalledWith(769);
  });
  it('navigates every card, stops at boundaries and supports direct selection', async () => {
    const screen = await render(<EmergenciesScreen />);
    expect(
      screen.getByRole('button', { name: 'Edellinen kortti' }),
    ).toBeDisabled();
    for (const card of emergencyCards.slice(1)) {
      await fireEvent.press(
        screen.getByRole('button', { name: 'Seuraava kortti' }),
      );
      expect(
        screen.getByRole('header', { name: card.title }),
      ).toBeOnTheScreen();
    }
    expect(
      screen.getByRole('button', { name: 'Seuraava kortti' }),
    ).toBeDisabled();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Näytä kaikki 12 korttia' }),
    );
    await fireEvent.press(
      screen.getByRole('button', {
        name: '6. Hypoksia yleisanestesian aikana',
      }),
    );
    expect(
      screen.getByRole('header', { name: 'Hypoksia yleisanestesian aikana' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('6 / 12')).toBeOnTheScreen();
  });
  it('tracks consecutive swipes in both directions and keeps navigation in sync', async () => {
    const screen = await render(<EmergenciesScreen />);
    for (const page of [1, 2, 3, 2, 1, 0, 11]) {
      await fireEvent.scroll(screen.getByTestId('emergency-pager'), {
        nativeEvent: {
          contentOffset: { x: page * 362, y: 0 },
          layoutMeasurement: { width: 362, height: 650 },
          contentSize: { width: 362 * 12, height: 650 },
        },
      });
      expect(screen.getByText(`${page + 1} / 12`)).toBeOnTheScreen();
      expect(
        screen.getByRole('header', { name: emergencyCards[page].title }),
      ).toBeOnTheScreen();
    }
    expect(
      screen.getByRole('button', { name: 'Seuraava kortti' }),
    ).toBeDisabled();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Edellinen kortti' }),
    );
    expect(screen.getByText('11 / 12')).toBeOnTheScreen();
  });
  it('keeps details separate and opens sources only on request', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    const screen = await render(<EmergenciesScreen />);
    expect(screen.queryByText('Lähde ja rajaukset')).toBeNull();
    await fireEvent.press(
      screen.getByRole('button', { name: /Lisätiedot ja lähteet:/ }),
    );
    expect(screen.queryByText('Lähde ja rajaukset')).toBeNull();
    expect(
      screen.getByRole('link', { name: /Association of Anaesthetists/ }),
    ).toBeOnTheScreen();
    expect(screen.getByText(/ei täydellinen hoito-ohje/)).toBeOnTheScreen();
    expect(open).not.toHaveBeenCalled();
    await fireEvent.press(
      screen.getByRole('link', { name: /Association of Anaesthetists/ }),
    );
    expect(open).toHaveBeenCalledWith(referenceUrl);
    await fireEvent.press(
      screen.getByRole('button', { name: 'Takaisin korttiin' }),
    );
    await fireEvent.press(
      screen.getByRole('button', { name: 'Seuraava kortti' }),
    );
    expect(screen.queryByText('Lähde ja rajaukset')).toBeNull();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Takaisin etusivulle' }),
    );
    expect(router.replace).toHaveBeenCalledWith('/');
    open.mockRestore();
  });
  it('shows a recoverable source-opening error', async () => {
    const open = jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValue(new Error('offline'));
    const screen = await render(<EmergenciesScreen />);
    await fireEvent.press(
      screen.getByRole('button', { name: /Lisätiedot ja lähteet:/ }),
    );
    await fireEvent.press(
      screen.getByRole('link', { name: /Association of Anaesthetists/ }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Lähde ei avautunut/,
    );
    open.mockResolvedValue(undefined);
    await fireEvent.press(
      screen.getByRole('link', { name: /Association of Anaesthetists/ }),
    );
    expect(screen.queryByRole('alert')).toBeNull();
    open.mockRestore();
  });
});
