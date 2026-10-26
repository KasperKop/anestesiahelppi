import { useEffect, useState } from 'react';
import { Keyboard, Platform, useWindowDimensions } from 'react-native';

export function useChatHeight() {
  const { height } = useWindowDimensions();
  const [visibleHeight, setVisibleHeight] = useState<number | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const viewport = window.visualViewport;
    const resize = () =>
      setVisibleHeight(viewport?.height ?? window.innerHeight);
    resize();
    viewport?.addEventListener('resize', resize);
    return () => viewport?.removeEventListener('resize', resize);
  }, []);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const show = Keyboard.addListener('keyboardWillShow', (event) =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener('keyboardWillHide', () =>
      setKeyboardHeight(0),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  // Reserve space for navigation and safe-area edges when the keyboard opens.
  // Static HTML and the first browser render must agree. Otherwise hydration
  // can retain the server's zero-window-height style until the next resize.
  const viewportHeight =
    Platform.OS === 'web' ? (visibleHeight ?? 752) : height;
  return Math.min(640, Math.max(260, viewportHeight - keyboardHeight - 112));
}
