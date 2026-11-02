import { useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Icon } from '@/src/ui/Icon';
import type { EmergencyCard, Medication } from './cards';
function Heading({
  children,
  light = false,
}: {
  children: string;
  light?: boolean;
}) {
  return (
    <Text accessibilityRole="header" style={[s.head, light && s.white]}>
      {children}
    </Text>
  );
}
function MedicationList({
  rows,
  alert,
}: {
  rows: Medication[];
  alert: boolean;
}) {
  const names = [...new Set(rows.map((r) => r.name))];
  return (
    <>
      {names.map((name) => {
        const list = rows.filter((r) => r.name === name);
        const routes = [
          ...new Set(
            list.map((r) => [r.route, r.mode].filter(Boolean).join(' · ')),
          ),
        ];
        return (
          <View
            key={name}
            style={[s.drug, alert && name === 'Adrenaliini' && s.hot]}
          >
            <Heading>{name}</Heading>
            {routes.map((route) => {
              const doses = list.filter(
                (r) => [r.route, r.mode].filter(Boolean).join(' · ') === route,
              );
              return (
                <View key={route} style={s.group}>
                  <Text style={s.label}>{route}</Text>
                  <View style={s.wrap}>
                    {doses.map((r, i) => (
                      <View key={i} style={s.cell}>
                        <Text style={s.label}>{r.group}</Text>
                        <Text style={s.value}>
                          {r.value} {r.unit}
                        </Text>
                        {r.maximum && (
                          <Text>
                            enintään {r.maximum.value} {r.maximum.unit}
                          </Text>
                        )}
                        {!!r.note && <Text>{r.note}</Text>}
                      </View>
                    ))}
                  </View>
                  {doses.map((r, i) =>
                    r.dilution ? (
                      <Text key={i}>Laimennus: {r.dilution}</Text>
                    ) : null,
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </>
  );
}
export function CardContents({
  card,
  onJump,
}: {
  card: EmergencyCard;
  onJump: (y: number) => void;
}) {
  const offset = useRef(0),
    med = useRef(0);
  return (
    <View
      testID="emergency-body"
      style={s.body}
      onLayout={(e) => {
        offset.current = e.nativeEvent.layout.y;
      }}
    >
      <Text style={s.start}>Aloita tästä</Text>
      {card.steps.map((v, i) => {
        const hot = 'target' in v && v.target === 'doses',
          space = v.text.indexOf(' ');
        return (
          <View key={i} style={[s.step, hot && s.hot]}>
            <View style={[s.number, hot && s.red]}>
              <Text style={[s.bold, s.white]}>{v.number}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={s.copy}>
                <Text style={s.bold}>
                  {space < 0 ? v.text : v.text.slice(0, space)}
                </Text>
                {space < 0 ? '' : v.text.slice(space)}
              </Text>
              {v.sub.map((t) => (
                <Text key={t} style={s.note}>
                  ▸ {t}
                </Text>
              ))}
              {hot && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Siirry annoksiin"
                  onPress={() => onJump(offset.current + med.current)}
                  style={s.jump}
                >
                  <Text style={[s.bold, s.white]}>Annokset</Text>
                  <Icon name="down" size={18} color="white" />
                </Pressable>
              )}
            </View>
          </View>
        );
      })}
      {card.medications.length > 0 && (
        <View
          onLayout={(e) => {
            med.current = e.nativeEvent.layout.y;
          }}
          testID="emergency-medication"
          style={[s.panel, { backgroundColor: '#12668A' }]}
        >
          <Heading light>Lääkitys</Heading>
          <MedicationList
            rows={card.medications}
            alert={card.id === 'anaphylaxis'}
          />
        </View>
      )}
      {(['symptoms', 'triggers', 'sections'] as const).map(
        (kind) =>
          card[kind].length > 0 && (
            <View
              key={kind}
              style={[
                s.panel,
                {
                  backgroundColor:
                    kind === 'symptoms'
                      ? '#FFF0DF'
                      : kind === 'triggers'
                        ? '#F2ECF8'
                        : '#EDF5F8',
                },
              ]}
            >
              {kind === 'symptoms' && <Heading>Oireet</Heading>}
              {card[kind].map((g) => (
                <View key={g.title} style={s.group}>
                  <Heading>{g.title}</Heading>
                  <View style={kind === 'sections' ? s.group : s.wrap}>
                    {g.items.map((t) => (
                      <Text
                        key={t}
                        style={kind === 'sections' ? s.note : s.chip}
                      >
                        {t}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ),
      )}
    </View>
  );
}
const s = StyleSheet.create({
  body: { gap: 8, marginBottom: 12 },
  start: {
    alignSelf: 'flex-start',
    backgroundColor: '#202A32',
    color: 'white',
    fontWeight: '700',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  step: {
    backgroundColor: '#EDF5F8',
    padding: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
  },
  hot: { backgroundColor: '#FBEAE6', borderWidth: 1, borderColor: '#C98A81' },
  number: {
    backgroundColor: '#202A32',
    minWidth: 26,
    minHeight: 26,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  white: { color: 'white' },
  bold: { fontWeight: '700' },
  red: { backgroundColor: '#A7241C' },
  jump: {
    alignSelf: 'flex-start',
    backgroundColor: '#A7241C',
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  copy: { fontSize: 16, lineHeight: 22, color: '#202832' },
  note: { fontSize: 14, lineHeight: 20, color: '#35444D' },
  panel: { borderRadius: 12, padding: 10, gap: 8 },
  drug: { backgroundColor: 'white', padding: 10, borderRadius: 10, gap: 8 },
  head: { fontSize: 18, fontWeight: '700', color: '#202832' },
  group: { gap: 5 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cell: {
    flexGrow: 1,
    flexBasis: 98,
    minWidth: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CFDBE0',
    padding: 7,
    borderRadius: 7,
  },
  label: { fontSize: 13, color: '#364955' },
  value: { fontSize: 17, fontWeight: '700', color: '#202832' },
  chip: {
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    color: '#202832',
    maxWidth: '100%',
  },
});
