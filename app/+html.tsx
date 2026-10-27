import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fi">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
      body { background: #F7F3EB; }
      button:focus-visible, input:focus-visible, textarea:focus-visible, [role=button]:focus-visible, [role=tab]:focus-visible { outline: 3px solid #915500; outline-offset: 2px; }
      .weight-range { appearance: none; -webkit-appearance: none; width: 100%; height: 48px; background: transparent; margin: 0; cursor: pointer; touch-action: pan-y; }
      .weight-range::-webkit-slider-runnable-track { height: 8px; border-radius: 8px; background: linear-gradient(to right, #136489 0 var(--fill), #D7D3C9 var(--fill) 100%); }
      .weight-range::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 30px; height: 30px; margin-top: -11px; border-radius: 50%; background: #136489; border: 3px solid white; box-shadow: 0 0 0 1px #136489; }
      .weight-range::-moz-range-track { height: 8px; background: #D7D3C9; border-radius: 8px; }
      .weight-range::-moz-range-progress { height: 8px; background: #136489; }
      .weight-range::-moz-range-thumb { width: 26px; height: 26px; border: 2px solid white; border-radius: 50%; background: #136489; }
    `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
