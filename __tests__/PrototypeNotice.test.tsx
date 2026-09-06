import { render } from '@testing-library/react-native';

import { PrototypeNotice } from '@/src/components/PrototypeNotice';

describe('PrototypeNotice', () => {
  it('makes the non-clinical status visible', async () => {
    const { getByText } = await render(<PrototypeNotice />);

    expect(getByText('Portfolio-prototyyppi')).toBeOnTheScreen();
    expect(getByText(/Ei kliiniseen käyttöön/)).toBeOnTheScreen();
  });
});
