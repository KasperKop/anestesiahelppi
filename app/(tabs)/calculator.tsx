import UnitSelect from '@/src/dilution/UnitSelect';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Panel, ui } from '@/src/ui/primitives';
import { useMemory } from '@/src/memory/context';
import { newId } from '@/src/chat/types';
import { initial, evaluate, lines } from '@/src/dilution/model';
import { formatConcentration, type Form } from '@/src/dilution/math';
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
    showLabel = true,
  ) {
    const err = seen[key] ? errors[key] : '';
    return (
      <View key={key}>
        {showLabel && <Text style={ui.small}>{label}</Text>}
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
          style={[ui.input, key === 'amount' && { height: 52 }]}
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
  function solvents(value: string, set: (v: string) => void) {
    return (
      <View style={{ gap: 8 }}>
        <Text style={ui.small}>Pikavalinta</Text>
        <View style={[ui.row, { gap: 8 }]}>
          {['NaCl 0,9 %', 'Glukoosi 5 %', 'Aqua'].map((v) => (
            <Pressable
              key={v}
              accessibilityRole="button"
              aria-pressed={value === v}
              onPress={() => set(v)}
              style={({ pressed }) => ({
                minHeight: 40,
                paddingHorizontal: 12,
                justifyContent: 'center',
                borderRadius: 24,
                borderWidth: 1,
                borderColor: value === v ? '#12668A' : '#9FB9C6',
                backgroundColor: value === v || pressed ? '#DCEDF5' : 'white',
              })}
            >
              <Text style={{ color: '#124D69', fontWeight: '600' }}>{v}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }
  // Shared label row keeps both input tops aligned regardless of label wrapping.
  function volumes(
    prefix: string,
    take: string,
    plus: string,
    set: (k: 'take' | 'plus', v: string) => void,
  ) {
    const labels = [
      prefix ? 'Otetaan edellisestä (ml)' : 'Otetaan (ml)',
      'Lisätään laimenninta (ml)',
    ];
    return (
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'stretch' }}>
          {labels.map((label) => (
            <Text key={label} style={[ui.small, { flex: 1 }]}>
              {label}
            </Text>
          ))}
        </View>
        <View
          style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}
        >
          {(['take', 'plus'] as const).map((k, i) => (
            <View key={k} style={{ flex: 1, minWidth: 0 }}>
              {field(
                prefix + k,
                labels[i],
                k === 'take' ? take : plus,
                (v) => set(k, v),
                true,
                false,
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }
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
          { padding: 16, gap: 12, paddingBottom: 112 },
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
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Text style={[ui.small, { flex: 1 }]}>
                {dry ? 'Kuiva-aineen määrä' : 'Valmisteen pitoisuus'}
              </Text>
              <Text style={[ui.small, { flex: 1 }]}>Yksikkö</Text>
            </View>
            <View
              style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                {field(
                  'amount',
                  dry ? 'Kuiva-aineen määrä' : 'Valmisteen pitoisuus',
                  f.amount,
                  (amount) => change({ ...f, amount }),
                  true,
                  false,
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <UnitSelect
                  value={f.unit}
                  liquid={!dry}
                  onChange={(unit) => change({ ...f, unit })}
                />
              </View>
            </View>
          </View>
          {dry
            ? base('vol', 'Liuottimen tilavuus (ml)')
            : volumes('', f.take, f.plus, (k, v) => change({ ...f, [k]: v }))}
          {base('sol', dry ? 'Liuottimen nimi' : 'Laimentimen nimi', false)}
          {solvents(f.sol, (sol) => change({ ...f, sol }))}
          {!!last && !!f.steps.length && (
            <Text>{formatConcentration(rows[0].concentration).text}</Text>
          )}
        </Panel>
        {f.steps.map((s, i) => (
          <Panel key={i}>
            <Text style={ui.title}>Vaihe {i + 2}</Text>
            {volumes('s' + i, s.take, s.plus, (k, v) =>
              change({
                ...f,
                steps: f.steps.map((old, j) =>
                  i === j ? { ...old, [k]: v } : old,
                ),
              }),
            )}
            {field(
              's' + i + 'sol',
              'Laimentimen nimi',
              s.sol,
              (sol) =>
                change({
                  ...f,
                  steps: f.steps.map((old, j) =>
                    i === j ? { ...old, sol } : old,
                  ),
                }),
              false,
            )}
            {solvents(s.sol, (sol) =>
              change({
                ...f,
                steps: f.steps.map((old, j) =>
                  i === j ? { ...old, sol } : old,
                ),
              }),
            )}
            {last && (
              <Text>{formatConcentration(rows[i + 1].concentration).text}</Text>
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lisää laimennusvaihe"
            onPress={() =>
              change({
                ...f,
                steps: [...f.steps, { take: '', plus: '', sol: '' }],
              })
            }
            style={{
              minHeight: 44,
              justifyContent: 'center',
              paddingVertical: 7,
            }}
          >
            {({ pressed }) => (
              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: '#12668A',
                  borderRadius: 24,
                  backgroundColor: pressed ? '#DCEDF5' : 'white',
                  minHeight: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#12668A',
                    fontWeight: '700',
                    paddingHorizontal: 8,
                  }}
                >
                  + Lisää laimennusvaihe
                </Text>
              </View>
            )}
          </Pressable>
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
                {last.ug ? '(' + last.ug + ') · ' : ''}yhteensä {last.volume}
              </Text>
              <Text style={{ color: 'white' }}>{last.summary}</Text>
            </View>
            {(last.warning || warning) && (
              <Text style={{ color: '#744710' }}>
                {last.warning || 'Tarkista arvot'}
              </Text>
            )}
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
                {r.formula} → {formatConcentration(r.concentration).text}
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
