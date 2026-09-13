import { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { Answer } from './types';
import { Button, Panel, ui } from '../ui/primitives';
export function AnswerCard({ answer }: { answer: Answer }) {
  const [expanded, setExpanded] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [now] = useState(() => Date.now());
  const stale = answer.citations.some((c) => Date.parse(c.nextReviewAt) <= now);
  return (
    <View style={{ gap: 12 }}>
      <Text style={ui.small}>
        {answer.mode === 'demo'
          ? 'VALMIS ESIMERKKI · Ei LLM-vastaus'
          : 'AI-TIIVISTELMÄ · Ei erikseen tarkistettu'}
      </Text>
      <Text accessibilityRole="header" style={ui.title}>
        {answer.title}
      </Text>
      <Text selectable style={ui.body}>
        {answer.body}
      </Text>
      {stale && (
        <Text style={ui.small}>
          Lähteen tarkistusajankohta on ohitettu. Tallennettu vastaus ei ole
          päivittynyt.
        </Text>
      )}
      {answer.citations.length > 0 && (
        <Button
          label={
            expanded
              ? 'Piilota lähteet'
              : `Näytä lähteet (${answer.citations.length})`
          }
          onPress={() => setExpanded(!expanded)}
        />
      )}
      {expanded &&
        answer.citations.map((c) => (
          <Panel key={c.chunkId}>
            <Text style={ui.title}>{c.title}</Text>
            <Text style={ui.small}>
              {c.locator} · Versio {c.version}
            </Text>
            <Text selectable style={ui.body}>
              {c.excerpt}
            </Text>
            <Text style={ui.small}>
              Lähde tarkistettu{' '}
              {new Date(c.reviewedAt).toLocaleDateString('fi-FI')}
            </Text>
            <Button
              label="Avaa alkuperäinen lähde ↗"
              onPress={() => {
                void Linking.openURL(c.url).catch(() =>
                  setLinkError('Lähdelinkin avaaminen epäonnistui.'),
                );
              }}
            />
          </Panel>
        ))}
      {!!linkError && (
        <Text accessibilityRole="alert" style={ui.small}>
          {linkError}
        </Text>
      )}
      <Text style={ui.small}>
        {new Date(answer.createdAt).toLocaleString('fi-FI')}
      </Text>
    </View>
  );
}
