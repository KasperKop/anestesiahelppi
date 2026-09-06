import {
  act,
  fireEvent,
  render,
  userEvent,
} from '@testing-library/react-native';

import { WeightSelector } from '@/src/components/WeightSelector';

describe('WeightSelector', () => {
  it('adjusts and confirms a whole-kilogram weight', async () => {
    const onConfirm = jest.fn();
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = await render(
      <WeightSelector onConfirm={onConfirm} />,
    );

    await user.press(getByLabelText('Lisää painoa yhdellä kilogrammalla'));
    await user.press(getByRole('button', { name: 'Näytä painokortti' }));

    expect(onConfirm).toHaveBeenCalledWith(16);
  });

  it('clamps slider values to the documented range', async () => {
    const onConfirm = jest.fn();
    const { getByLabelText, getByRole } = await render(
      <WeightSelector onConfirm={onConfirm} />,
    );

    await act(async () => {
      fireEvent(
        getByLabelText('Potilaan paino kilogrammoina'),
        'valueChange',
        50,
      );
    });
    await userEvent
      .setup()
      .press(getByRole('button', { name: 'Näytä painokortti' }));

    expect(onConfirm).toHaveBeenCalledWith(30);
  });
});
