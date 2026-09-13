import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { changeMemory, emptyMemory, MemoryAction, MemoryState } from './model';
import { readMemory, writeMemory } from './storage';
type MemoryContextType = {
  state: MemoryState;
  ready: boolean;
  error: string;
  busy: boolean;
  act: (action: MemoryAction) => Promise<void>;
  retry: () => void;
};
const MemoryContext = createContext<MemoryContextType | null>(null);
export function MemoryProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState(emptyMemory);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    readMemory()
      .then((value) => {
        if (active) {
          current.current = value;
          setState(value);
          setReady(true);
          setError('');
        }
      })
      .catch(() => {
        if (active)
          setError(
            'Tietopankin avaaminen epäonnistui. Vanhoja tietoja ei ylikirjoiteta.',
          );
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  async function act(action: MemoryAction) {
    if (!ready || locked.current)
      throw new Error('Odota, tietopankkia käsitellään.');
    locked.current = true;
    setBusy(true);
    try {
      const next = changeMemory(current.current, action);
      await writeMemory(next);
      current.current = next;
      setState(next);
      setError('');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Tallennus epäonnistui.';
      setError(message);
      throw new Error(message);
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return (
    <MemoryContext.Provider
      value={{
        state,
        ready,
        error,
        busy,
        act,
        retry: () => setAttempt((a) => a + 1),
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}
export function useMemory() {
  const context = useContext(MemoryContext);
  if (!context) throw new Error('MemoryProvider puuttuu');
  return context;
}
