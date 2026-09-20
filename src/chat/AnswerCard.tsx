import { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { Answer } from './types';
import { Button, Panel, ui } from '../ui/primitives';
export function AnswerCard({ answer }: { answer: Answer }) {
  const [expanded, setExpanded] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [now] = useState(() => Date.now());
  const usesWiki = answer.citations.some((c) => c.evidenceType === 'wiki');
  const stale = answer.citations.some((c) => Date.parse(c.nextReviewAt) <= now);
  return (
    <View style={{ gap: 12 }}>
      <Text style={ui.small}>
        {answer.mode === 'demo'
          ? 'VALMIS ESIMERKKI · Ei LLM-vastaus'
          : answer.evidenceMode === 'research'
            ? usesWiki
              ? 'TIETOHAKUDEMO · Wiki ja tutkimuslähteet · Ei hoito-ohje'
              : 'TUTKIMUSDEMO · Abstraktipohjainen · Ei hoito-ohje'
            : 'AI-TIIVISTELMÄ · Ei erikseen tarkistettu'}
      </Text>
      <Text accessibilityRole="header" style={ui.title}>
        {answer.title}
      </Text>
      <Text selectable style={ui.body}>
        {answer.body}
      </Text>
      {answer.searchQuery && (
        <Text style={ui.small}>Hakusanat: {answer.searchQuery}</Text>
      )}
      {answer.searches?.map((s) => (
        <Text key={s.provider} style={ui.small}>
          {s.provider}:{' '}
          {s.status === 'error'
            ? 'haku epäonnistui – tämän lähteen tulokset puuttuvat'
            : `${s.count} hakutulosta käsitelty`}
        </Text>
      ))}
      {answer.evidenceMode === 'research' && (
        <Text style={ui.small}>
          Rajattu lähdehaku; ei kattava näytön arvio. Tallennettu vastaus ei
          päivity automaattisesti.
        </Text>
      )}
      {usesWiki && (
        <View style={{ gap: 8 }}>
          <Text style={ui.small}>
            WikiAnesthesian tekstiä on lyhennetty ja käännetty tekoälyllä.
            Wikiin perustuva vastausteksti: CC BY-SA 4.0. Tekijät ja
            alkuperäiset versiot näkyvät lähteissä.
          </Text>
          <Button
            label="CC BY-SA 4.0 -lisenssi ↗"
            onPress={() => {
              void Linking.openURL(
                'https://creativecommons.org/licenses/by-sa/4.0/',
              ).catch(() => setLinkError('Linkin avaaminen epäonnistui.'));
            }}
          />
        </View>
      )}
      {stale && (
        <Text style={ui.small}>
          Lähteen tarkistusajankohta on ohitettu. Tallennettu vastaus ei ole
          päivittynyt.
        </Text>
      )}
      {(answer.citations.length > 0 || !!answer.searchResults?.length) && (
        <Button
          label={
            expanded
              ? 'Piilota lähteet'
              : answer.citations.length
                ? `Näytä lähteet (${answer.citations.length})`
                : 'Näytä hakutulokset'
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
              {c.evidenceType === 'abstract' || c.evidenceType === 'wiki'
                ? `${c.provider} · ${c.license} · Haettu ${new Date(c.retrievedAt!).toLocaleDateString('fi-FI')}. Ei kliinisesti tarkistettu.`
                : `Lähde tarkistettu ${new Date(c.reviewedAt).toLocaleDateString('fi-FI')}`}
            </Text>
            {c.evidenceType === 'wiki' && (
              <>
                <Text style={ui.small}>
                  {c.attribution} · Yhteisön muokkaama wikiartikkeli.
                </Text>
                <Button
                  label="Tekijät ja muutoshistoria ↗"
                  onPress={() => {
                    void Linking.openURL(c.historyUrl!).catch(() =>
                      setLinkError('Linkin avaaminen epäonnistui.'),
                    );
                  }}
                />
              </>
            )}
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
      {expanded &&
        answer.evidenceMode === 'research' &&
        !!answer.searchResults?.length && (
          <View style={{ gap: 8 }}>
            <Text style={ui.label}>LÖYDETTYJÄ ARTIKKELEITA</Text>
            {answer.searchResults.slice(0, 5).map((r) => (
              <Button
                key={r.id}
                label={`${r.title} ↗ (${r.providers.join(', ')})`}
                onPress={() => {
                  void Linking.openURL(r.url).catch(() =>
                    setLinkError('Lähdelinkin avaaminen epäonnistui.'),
                  );
                }}
              />
            ))}
            <Text style={ui.small}>
              Hakutulos ei yksin ole vastauksen lähde. Käytetyt lähdekatkelmat
              näkyvät kohdassa Näytä lähteet.
            </Text>
            <Button
              label="PubMedin käyttöehdot ↗"
              onPress={() => {
                void Linking.openURL(
                  'https://www.ncbi.nlm.nih.gov/About/disclaimer.html',
                ).catch(() => setLinkError('Linkin avaaminen epäonnistui.'));
              }}
            />
          </View>
        )}
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
