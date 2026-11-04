import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Panel, ui } from '@/src/ui/primitives';
import { useMemory } from '@/src/memory/context';
import { newId } from '@/src/chat/types';
import { initial, evaluate, lines } from '@/src/dilution/model';
import type { Form, Step } from '@/src/dilution/math';
export default function Calculator() {
  const m = useMemory(),
    params = useLocalSearchParams(),
    [loaded, setLoaded] = useState('');
  const [f, F] = useState(initial),
    [edit, E] = useState(''),
    [seen, S] = useState<Record<string, boolean>>({}),
    [notice, N] = useState(''),
    [formula, Q] = useState(false),
    [clear, C] = useState(false);
  const key = params.cardId + ':' + params.visit;
  if (m.ready && params.cardId && loaded !== key) {
    setLoaded(key);
    let c = m.state.cards.find((x) => x.id === params.cardId);
    if (c?.dilution) {
      F(c.dilution.form);
      E(c.id);
      N('');
      S({});
      C(false);
    }
  }
  const { rows, errors, warning } = evaluate(f),
    last = rows[rows.length - 1],
    dry = f.type === 'dry';
  function change(next: Form) {
    F(next);
    N('');
    C(false);
  }
  function field(
    key: string,
    label: string,
    value: string,
    set: (s: string) => void,
    numeric = true,
  ) {
    const err = seen[key] ? errors[key] : '';
    return (
      <View key={key}>
        <Text style={ui.small}>{label}</Text>
        <TextInput
          accessibilityLabel={label}
          aria-describedby={err ? 'error-' + key : undefined}
          inputMode={numeric ? 'decimal' : 'text'}
          maxLength={numeric ? 40 : 120}
          value={value}
          onChangeText={(s) => {
            set(s);
            S({ ...seen, [key]: true });
          }}
          onBlur={() => S((v) => ({ ...v, [key]: true }))}
          style={ui.input}
        />
        {!!err && <Text nativeID={'error-' + key}>{err}</Text>}
      </View>
    );
  }
  const base = (
    k: 'name' | 'amount' | 'vol' | 'take' | 'plus' | 'sol',
    l: string,
    n = true,
  ) => field(k, l, f[k], (v) => change({ ...f, [k]: v }), n);
  function reset() {
    change(initial());
    E('');
    S({});
    Q(false);
  }
  function choice(label: string, active: boolean, fn: () => void) {
    return (
      <Pressable
        key={label}
        accessibilityRole="radio"
        accessibilityState={{ checked: active }}
        onPress={fn}
        style={[
          ui.button,
          { flex: 1, paddingHorizontal: 3 },
          active && ui.primary,
        ]}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: '700',
            color: active ? 'white' : '#12668A',
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  }
  async function save() {
    const id = edit || newId();
    try {
      await m.act({ type: 'saveDilution', id, edit: !!edit, form: f });
      E(id);
      N('Tallennettu pinoon Laimennukset');
    } catch (e) {
      N(e instanceof Error ? e.message : 'Tallennus epäonnistui.');
    }
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[
          ui.page,
          { padding: 16, gap: 12, paddingBottom: 80 },
        ]}
      >
        <Text style={ui.label}>ANESTESIAHELPPI</Text>
        <Text accessibilityRole="header" style={ui.heading}>
          Laimennuslaskuri
        </Text>
        <Text>Ei potilastietoja. Tarkista aina valmistajan ohjeesta.</Text>
        <View accessibilityRole="radiogroup" style={ui.row}>
          {choice('Kuiva-aine', dry, () => {
            if (!dry) {
              change({ ...initial(), name: f.name });
              S({});
            }
          })}
          {choice('Neste', !dry, () => {
            if (dry) {
              change({ ...initial(), type: 'liq', name: f.name });
              S({});
            }
          })}
        </View>
        <Text style={ui.small}>
          {dry
            ? 'Injektiopullon jauhe liuotetaan nesteeseen.'
            : 'Valmis liuos (esim. ampulli) laimennetaan nesteellä.'}
        </Text>
        <Panel>
          {base('name', 'Valmisteen nimi (ja vaikuttava aine)', false)}
          <Text style={ui.small}>Älä kirjoita potilastietoja.</Text>
          {base('amount', dry ? 'Kuiva-aineen määrä' : 'Valmisteen pitoisuus')}
          <Text>Yksikkö</Text>
          <View accessibilityRole="radiogroup" style={ui.row}>
            {['µg', 'mg', 'g'].map((u) =>
              choice(u + (dry ? '' : '/ml'), f.unit === u, () =>
                change({ ...f, unit: u }),
              ),
            )}
          </View>
          {dry ? (
            base('vol', 'Liuottimen tilavuus (ml)')
          ) : (
            <>
              {base('take', 'Otetaan (ml)')}
              {base('plus', 'Lisätään laimenninta (ml)')}
            </>
          )}
          {base('sol', dry ? 'Liuottimen nimi' : 'Laimentimen nimi', false)}
          {!!last && !!f.steps.length && (
            <Text>
              {rows[0].mg} = {rows[0].ug}
            </Text>
          )}
        </Panel>
        {f.steps.map((s, i) => (
          <Panel key={i}>
            <Text style={ui.title}>Vaihe {i + 2}</Text>
            {(['take', 'plus', 'sol'] as (keyof Step)[]).map((k) =>
              field(
                's' + i + k,
                {
                  take: 'Otetaan edellisestä (ml)',
                  plus: 'Lisätään laimenninta (ml)',
                  sol: 'Laimentimen nimi',
                }[k],
                s[k],
                (v) =>
                  change({
                    ...f,
                    steps: f.steps.map((old, j) =>
                      i === j ? { ...old, [k]: v } : old,
                    ),
                  }),
                k !== 'sol',
              ),
            )}
            {last && (
              <Text>
                {rows[i + 1].mg} = {rows[i + 1].ug}
              </Text>
            )}
            {i === f.steps.length - 1 && (
              <Button
                label="Poista viimeinen vaihe"
                onPress={() => change({ ...f, steps: f.steps.slice(0, -1) })}
              />
            )}
          </Panel>
        ))}
        {f.steps.length < 4 && (
          <Button
            label="+ Lisää laimennusvaihe"
            onPress={() =>
              change({
                ...f,
                steps: [...f.steps, { take: '', plus: '', sol: '' }],
              })
            }
          />
        )}
        {last && (
          <>
            <View
              aria-live="polite"
              style={{
                backgroundColor: '#12668A',
                padding: 16,
                borderRadius: 16,
                gap: 4,
              }}
            >
              <Text style={{ color: 'white' }}>LOPPUPITOISUUS</Text>
              <Text style={[ui.heading, { color: 'white' }]}>{last.mg}</Text>
              <Text style={{ color: 'white' }}>
                = {last.ug} · yhteensä {last.volume}
              </Text>
              <Text style={{ color: 'white' }}>{last.summary}</Text>
            </View>
            {warning && <Text>Tarkista arvot</Text>}
            <Panel>
              <Text style={ui.small}>MUISTIINPANON ESIKATSELU · LAIMENNUS</Text>
              <Text style={ui.title}>{f.name}</Text>
              <Text>{lines(rows)}</Text>
            </Panel>
          </>
        )}
        <Button
          label={edit ? 'Tallenna muutokset' : 'Tallenna muistiinpanoksi'}
          primary
          disabled={!m.ready || m.busy || !last || !f.name.trim()}
          onPress={save}
        />
        {(!last || !f.name.trim()) && (
          <Text>
            {!last
              ? 'Täytä vaiheiden kentät kelvollisilla arvoilla.'
              : 'Kirjoita valmisteen nimi tallentaaksesi.'}
          </Text>
        )}
        <Button label="Näytä laskenta" onPress={() => Q(!formula)} />
        {formula && (
          <Panel>
            {rows.map((r, i) => (
              <Text key={i}>
                {r.formula} = {r.mg}
              </Text>
            ))}
            {dry && (
              <Text>
                Laskelmassa ei huomioida kuiva-aineen viemää tilavuutta.
              </Text>
            )}
          </Panel>
        )}
        <Button
          label="Tyhjennä kentät"
          onPress={() =>
            JSON.stringify(f) === JSON.stringify(initial()) ? reset() : C(true)
          }
        />
        {clear && (
          <Panel>
            <Text>Tyhjennetäänkö kaikki kentät?</Text>
            <Button label="Tyhjennä" onPress={reset} />
            <Button label="Peruuta" onPress={() => C(false)} />
          </Panel>
        )}
        <Text aria-live="polite">{notice || m.error}</Text>
        {notice.startsWith('Tallennettu') && (
          <Button
            label="Avaa Laimennukset"
            onPress={() =>
              router.navigate({
                pathname: '/saved',
                params: {
                  stackId:
                    m.state.cards.find((c) => c.id === edit)?.stackId || '',
                  visit: String(Date.now()),
                },
              })
            }
          />
        )}
        <Text style={ui.small}>
          Portfolio-prototyyppi · Ei kliiniseen käyttöön.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
