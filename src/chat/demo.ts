import { Answer, newId } from './types';

export const examples = [
  {
    question: 'Miten tallennan vastauksen?',
    title: 'Oma tietopankki',
    body: 'Paina vastauksen sydäntä. Kortti tallentuu Järjestämättömiin. Löydät sen vasemman välilehden Omat pinot -näkymästä ja voit siirtää sen itse nimeämääsi pinoon.',
  },
  {
    question: 'Miten lähteet näkyvät?',
    title: 'Lähde kulkee vastauksen mukana',
    body: 'Varsinaisessa chatissa vastauksen alla näkyvät käytetyt dokumentit. Avaamalla lähteen näet tekstikatkelman, sijainnin ja version. Tämä valmis esimerkki esittelee toimintoa eikä sisällä lääketieteellistä tietoa.',
  },
  {
    question: 'Mitä jos tietoa ei löydy?',
    title: 'Vastaus vain lähteiden perusteella',
    body: 'Jos hyväksytyistä lähteistä ei löydy riittävää tietoa, chat kertoo sen. Yhteysvirhe ja käyttörajan täyttyminen ilmoitetaan erikseen. Tallennetut kortit säilyvät käytettävissä ilman verkkoyhteyttä.',
  },
];
export function demoAnswer(question: string): Answer {
  const example = examples.find(
    (item) =>
      item.question.toLocaleLowerCase('fi') ===
      question.trim().toLocaleLowerCase('fi'),
  );
  return {
    id: newId(),
    question,
    title: example?.title ?? 'Esittelytila',
    body:
      example?.body ??
      'Esittelytila sisältää vain valmiit esimerkkikysymykset. Valitse jokin yllä olevista esimerkeistä kokeillaksesi tallennusta ja pinoja. Vapaa lähdehaku tarvitsee erikseen määritetyn chat-palvelun.',
    citations: [],
    createdAt: new Date().toISOString(),
    status: example ? 'answered' : 'not_found',
    mode: 'demo',
  };
}
