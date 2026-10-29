import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ui } from '../ui/primitives';
import { Icon } from '../ui/Icon';
import { colors, radii, spacing } from '../theme/tokens';
import { useSettings } from './context';
import {
  calculateDose,
  defaultValue,
  doseLabel,
  Drug,
  drugs,
  formatNumber,
  isRange,
  parseDose,
  significantDeviation,
} from './model';

export function ModifiedBadge() {
  return (
    <View style={styles.badge}>
      <Icon name="pencil" size={12} color="#704600" />
      <Text style={styles.badgeText}>Muokattu</Text>
    </View>
  );
}
export function SettingsNotice() {
  const { error } = useSettings();
  return error ? (
    <Text accessibilityRole="alert" style={styles.warning}>
      {error}
    </Text>
  ) : null;
}
function Disclaimer() {
  return (
    <Text style={styles.note}>
      Ei kliiniseen käyttöön. Tarkista annokset aina yksikön omasta ohjeesta.
    </Text>
  );
}
function Editor({ drug, close }: { drug: Drug; close: () => void }) {
  const { settings, weight, save, reset, busy } = useSettings();
  const initial =
    settings.overrides[drug.id] ??
    (drug.defaultDose === 'table' ? undefined : drug.defaultDose);
  const [low, setLow] = useState(
    initial ? formatNumber(initial.dosePerKg) : '',
  );
  const [high, setHigh] = useState(
    initial?.maxDosePerKg === undefined
      ? ''
      : formatNumber(initial.maxDosePerKg),
  );
  const [touched, setTouched] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const dose = parseDose(drug, low, high);
  const warning = dose ? significantDeviation(drug, dose) : false;
  const error =
    touched && !dose
      ? 'Anna nollaa suurempi luku, enintään 2 desimaalia. Vaihteluvälin yläraja ei saa alittaa alarajaa.'
      : '';
  const field = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    id: string,
  ) => (
    <View style={{ gap: spacing.sm }}>
      <Text nativeID={`${id}-label`} style={ui.body}>
        {label}
      </Text>
      <View style={styles.fieldRow}>
        <TextInput
          accessibilityLabel={label}
          aria-labelledby={`${id}-label`}
          aria-describedby={error ? 'dose-error' : 'dose-default'}
          aria-invalid={!!error}
          inputMode="decimal"
          keyboardType="decimal-pad"
          value={value}
          editable={!busy}
          maxLength={16}
          onChangeText={(v) => {
            setValue(v);
            setTouched(true);
            setConfirmed(false);
          }}
          onFocus={(event) => {
            if (Platform.OS === 'web') {
              const target = event.target as unknown as {
                scrollIntoView?: (options: object) => void;
              };
              target.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
            }
          }}
          style={[
            ui.input,
            { flex: 1, minWidth: 0 },
            !!error && { borderColor: '#926000' },
          ]}
        />
        <Text style={ui.body}>{drug.unit}/kg</Text>
      </View>
    </View>
  );
  return (
    <>
      <Button
        label="Takaisin asetuksiin"
        icon="left"
        onPress={close}
        disabled={busy}
      />
      <Text accessibilityRole="header" style={ui.heading}>
        {drug.name}
      </Text>
      {field(
        isRange(drug) ? 'Annoksen alaraja' : 'Annos painokiloa kohti',
        low,
        setLow,
        'dose-low',
      )}
      {isRange(drug) && field('Annoksen yläraja', high, setHigh, 'dose-high')}
      <Text nativeID="dose-default" style={styles.note}>
        {drug.defaultDose === 'table'
          ? `Oletus: painokohtainen taulukko. Painolla ${weight} kg: ${defaultValue(drug, weight)}. Uusi vaihteluväli koskee kaikkia painoja; palautus palauttaa taulukon.`
          : `Oletus: ${doseLabel(drug.defaultDose, drug.unit)}`}
      </Text>
      {!!error && (
        <Text
          nativeID="dose-error"
          accessibilityRole="alert"
          style={styles.warning}
        >
          {error}
        </Text>
      )}
      <View style={styles.preview}>
        <Text accessibilityLiveRegion="polite" style={ui.body}>
          Painolla {weight} kg: {dose ? calculateDose(drug, weight, dose) : '–'}
        </Text>
      </View>
      {warning && (
        <View style={{ gap: spacing.sm }}>
          <Text accessibilityRole="alert" style={styles.warning}>
            Arvo poikkeaa oletuksesta merkittävästi. Tarkista.
            {drug.defaultDose === 'table'
              ? ' Vertailu kattaa taulukon kaikki painot.'
              : ''}
          </Text>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel="Olen tarkistanut arvon"
            accessibilityState={{ checked: confirmed }}
            onPress={() => setConfirmed(!confirmed)}
            style={styles.confirm}
          >
            <Icon name={confirmed ? 'check' : 'square'} color="#704600" />
            <Text style={[ui.body, { flex: 1 }]}>Olen tarkistanut arvon</Text>
          </Pressable>
        </View>
      )}
      <Button
        primary
        label="Tallenna"
        disabled={!dose || busy || (warning && !confirmed)}
        onPress={async () => {
          if (dose && (await save(drug.id, dose))) close();
        }}
      />
      <Button
        label="Palauta oletus"
        disabled={busy || !settings.overrides[drug.id]}
        onPress={async () => {
          if (await reset(drug.id)) close();
        }}
      />
      <Text style={styles.note}>
        Muutos päivittää kaikki painokortit. Asetukset tallennetaan vain tälle
        laitteelle ja selaimelle.
      </Text>
    </>
  );
}
export default function SettingsScreen() {
  const { settings, ready, busy, reset } = useSettings();
  const [editing, setEditing] = useState<Drug>();
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState('');
  const count = Object.keys(settings.overrides).length;
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={[
            ui.page,
            { padding: spacing.md, gap: spacing.md },
          ]}
        >
          <SettingsNotice />
          {!ready ? (
            <Text style={ui.body}>Ladataan asetuksia…</Text>
          ) : editing ? (
            <Editor
              key={editing.id}
              drug={editing}
              close={() => setEditing(undefined)}
            />
          ) : (
            <>
              <Text accessibilityRole="header" style={ui.heading}>
                Asetukset
              </Text>
              <Text style={ui.body}>
                Muuta lääkkeiden annosta per kilo. Muutos päivittää kaikki
                painokortit.
              </Text>
              {!!notice && (
                <Text accessibilityLiveRegion="polite" style={styles.note}>
                  {notice}
                </Text>
              )}
              <View style={styles.list}>
                {drugs.map((drug) => {
                  const override = settings.overrides[drug.id];
                  return (
                    <Pressable
                      key={drug.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Muokkaa: ${drug.name}`}
                      onPress={() => {
                        setNotice('');
                        setEditing(drug);
                      }}
                      style={({ pressed }) => [
                        styles.listRow,
                        pressed && {
                          backgroundColor: colors.supportingSurface,
                        },
                      ]}
                    >
                      <View style={{ flex: 1, gap: spacing.xs }}>
                        <Text style={ui.title}>{drug.name}</Text>
                        <Text style={ui.body}>
                          {override
                            ? doseLabel(override, drug.unit)
                            : drug.defaultDose === 'table'
                              ? 'Painokohtainen taulukko'
                              : doseLabel(drug.defaultDose, drug.unit)}
                        </Text>
                        {!!override && (
                          <>
                            <ModifiedBadge />
                            <Text style={styles.note}>
                              Oletus:{' '}
                              {drug.defaultDose === 'table'
                                ? 'painokohtainen taulukko'
                                : doseLabel(drug.defaultDose, drug.unit)}
                            </Text>
                          </>
                        )}
                      </View>
                      <Icon name="right" size={20} />
                    </Pressable>
                  );
                })}
              </View>
              <Button
                label="Palauta kaikki oletukset"
                disabled={!count || busy}
                onPress={() => setConfirmReset(true)}
              />
            </>
          )}
          <Disclaimer />
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={confirmReset}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!busy) setConfirmReset(false);
        }}
      >
        <View style={styles.overlay}>
          <View accessibilityViewIsModal style={styles.dialog}>
            <Text accessibilityRole="header" style={ui.title}>
              Palautetaanko oletukset?
            </Text>
            <Text style={ui.body}>
              {count} lääkkeen muutos poistetaan. Alkuperäiset annokset
              palautuvat. Muistiinpanot ja tallennetut kortit säilyvät.
            </Text>
            <Button
              primary
              label="Palauta oletukset"
              disabled={busy}
              onPress={async () => {
                const ok = await reset();
                setConfirmReset(false);
                if (ok) setNotice('Kaikki oletukset palautettu.');
              }}
            />
            <Button
              label="Peruuta"
              disabled={busy}
              onPress={() => setConfirmReset(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FFF0CA',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  badgeText: { color: '#704600', fontSize: 11, fontWeight: '700' },
  note: { fontSize: 13, lineHeight: 20, color: '#505B64' },
  warning: {
    color: '#704600',
    backgroundColor: '#FFF0CA',
    padding: spacing.md,
    borderRadius: radii.md,
    fontSize: 14,
    lineHeight: 22,
  },
  fieldRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  preview: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.supportingSurface,
  },
  confirm: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  list: {
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
});
