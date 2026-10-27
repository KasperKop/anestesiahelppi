import {
  act,
  fireEvent,
  render,
  userEvent,
} from '@testing-library/react-native';

import { WeightSelector } from '@/src/components/WeightSelector';

describe('WeightSelector', () => {
  it('disables only the boundary step and announces kilograms', async () => {
    const screen = await render(<WeightSelector onConfirm={jest.fn()} />);
    await fireEvent(screen.getByLabelText('Paino'), 'valueChange', 3);
    expect(screen.getByLabelText('Vähennä painoa 1 kg')).toBeDisabled();
    expect(screen.getByLabelText('Lisää painoa 1 kg')).toBeEnabled();
    expect(screen.getByLabelText('Paino')).toHaveAccessibilityValue({
      text: '3 kg',
    });
    await fireEvent(screen.getByLabelText('Paino'), 'valueChange', 30);
    expect(screen.getByLabelText('Lisää painoa 1 kg')).toBeDisabled();
    expect(screen.getByLabelText('Vähennä painoa 1 kg')).toBeEnabled();
  });
  it('adjusts and confirms a whole-kilogram weight', async () => {
    const onConfirm = jest.fn();
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = await render(
      <WeightSelector onConfirm={onConfirm} />,
    );

    await user.press(getByLabelText('Lisää painoa 1 kg'));
    await user.press(getByRole('button', { name: 'Näytä painokortti' }));

    expect(onConfirm).toHaveBeenCalledWith(16);
  });

  it('clamps slider values to the documented range', async () => {
    const onConfirm = jest.fn();
    const { getByLabelText, getByRole } = await render(
      <WeightSelector onConfirm={onConfirm} />,
    );

    await act(async () => {
      fireEvent(getByLabelText('Paino'), 'valueChange', 50);
    });
    await userEvent
      .setup()
      .press(getByRole('button', { name: 'Näytä painokortti' }));

    expect(onConfirm).toHaveBeenCalledWith(30);
  });
});
