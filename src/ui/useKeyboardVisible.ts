import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/** VisualViewport handles iOS Safari's keyboard without treating browser chrome as a keyboard. */
export function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'web') {
      const viewport = window.visualViewport;
      const update = () => {
        const element = document.activeElement;
        const editing =
          element?.tagName === 'TEXTAREA' || element?.tagName === 'INPUT';
        setVisible(
          !!editing && !!viewport && window.innerHeight - viewport.height > 150,
        );
      };
      viewport?.addEventListener('resize', update);
      document.addEventListener('focusin', update);
      document.addEventListener('focusout', update);
      return () => {
        viewport?.removeEventListener('resize', update);
        document.removeEventListener('focusin', update);
        document.removeEventListener('focusout', update);
      };
    }
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}
