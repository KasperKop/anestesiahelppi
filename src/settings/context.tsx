import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dose,
  drugs,
  emptySettings,
  sameAsDefault,
  Settings,
  validDose,
} from './model';
import { readSettings, writeSettings } from './storage';
const Context = createContext<{
  settings: Settings;
  ready: boolean;
  busy: boolean;
  error: string;
  weight: number;
  setWeight: (weight: number) => void;
  save: (id: string, dose: Dose) => Promise<boolean>;
  reset: (id?: string) => Promise<boolean>;
} | null>(null);
export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState(emptySettings);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [weight, setWeight] = useState(15);
  const current = useRef(settings);
  const writing = useRef(false);
  useEffect(() => {
    let active = true;
    readSettings()
      .then((value) => {
        if (active) {
          current.current = value;
          setSettings(value);
        }
      })
      .catch(() => {
        if (active)
          setError('Asetuksia ei voitu lukea. Käytössä ovat oletusannokset.');
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  async function commit(next: Settings) {
    if (!ready || writing.current) return false;
    writing.current = true;
    setBusy(true);
    try {
      await writeSettings(next);
      current.current = next;
      setSettings(next);
      setError('');
      return true;
    } catch {
      current.current = emptySettings();
      setSettings(current.current);
      setError(
        'Asetusten tallennus epäonnistui. Käytössä ovat oletusannokset. Aiemmat tallennetut muutokset voivat palata seuraavalla avauskerralla.',
      );
      return false;
    } finally {
      writing.current = false;
      setBusy(false);
    }
  }
  async function reset(id?: string) {
    const overrides = { ...current.current.overrides };
    if (id) delete overrides[id];
    return commit({ version: 1, overrides: id ? overrides : {} });
  }
  async function save(id: string, dose: Dose) {
    const drug = drugs.find((item) => item.id === id);
    if (!drug || !validDose(drug, dose)) return false;
    if (sameAsDefault(drug, dose)) return reset(id);
    return commit({
      version: 1,
      overrides: {
        ...current.current.overrides,
        [id]: { ...dose, modifiedAt: new Date().toISOString() },
      },
    });
  }
  return (
    <Context.Provider
      value={{ settings, ready, busy, error, weight, setWeight, save, reset }}
    >
      {children}
    </Context.Provider>
  );
}
export function useSettings() {
  const context = useContext(Context);
  if (!context) throw new Error('SettingsProvider puuttuu');
  return context;
}
