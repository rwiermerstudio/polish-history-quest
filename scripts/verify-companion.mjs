import { existsSync, readFileSync, readdirSync } from 'node:fs';

const cssPath = 'public/history-companion.css';
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const count = (html, pattern) => (html.match(pattern) || []).length;

assert(existsSync(cssPath), `missing ${cssPath}`);
const css = readFileSync(cssPath, 'utf8');
const companionFiles = readdirSync('public')
  .filter(file => /^chapter-\d+-companion\.html$/.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
assert(companionFiles.length >= 1, 'at least one chapter companion is required');

const auditAnchors = {
  'chapter-1-companion.html': [
    [/Misacam regem,[\s\S]*Sclavi qui dicuntur Licicaviki,[\s\S]*duabus vicibus superavit/, 'Widukind'],
    [/Misicam et Labertus[\s\S]*Glanvell’s printed main text/, 'Dagome iudex'],
    [/Laurentian recension, entry 6489 \(981\)[\s\S]*col\. 81[\s\S]*psrl_tom01/, 'Primary Chronicle'],
    [/Quae regio, quamvis multum sit nemorosa[\s\S]*page\/425/, 'Gallus prologue'],
  ],
  'chapter-2-companion.html': [
    [/1138\. Boleslaus III dictus, inclitus dux Polonorum, obiit[\s\S]*Monumenta Poloniae Historica[\s\S]*p\. 832/, 'Kraków annal notice'],
    [/Intendentes ergo locare civitatem in Cracovia[\s\S]*Kodeks dyplomatyczny miasta Krakowa[\s\S]*no\. 1/, 'Kraków location charter'],
    [/Tarthari Cracoviam intrantes ecclesias succendunt[\s\S]*Annales Poloniae[\s\S]*p\. 23[\s\S]*p\. 598/, 'Kraków chapter annals'],
    [/REDDIDIT IPSE \[POTENS, DEUS\?\] VICTRICIA SIGNA POLONIS[\s\S]*competing restorations/, 'Przemysł II seal'],
    [/Dux Wladislaus dictus Lokethk coronatur[\s\S]*Monumenta Poloniae Historica[\s\S]*p\. 880/, 'Sędziwój annal'],
    [/Proinde Nos Kazimirus[\s\S]*studium vigeat generale[\s\S]*no\. 1, pp\. 60–61/, 'Kraków university charter'],
    [/Sed hiis tantum[\s\S]*duo grossi usualis monete[\s\S]*locatis et possessis[\s\S]*no\. 1709, pp\. 425–427/, 'Koszyce privilege'],
    [/Jagalo dux saepedictus[\s\S]*terras suas Litvaniae et Rusiae[\s\S]*perpetuo applicare[\s\S]*Akta unji Polski z Litwą[\s\S]*at p\. 2/, 'Krewo Act'],
  ],
  'chapter-3-companion.html': [
    [/Nos Jagalo, virtute Dei dux magnus Litwanorum[\s\S]*inspecturis, \[…\][\s\S]*no\. 1, printed p\. 1 \(scan PDF leaf 58\)/, 'Krewo titulature'],
    [/quae etiam bona post mortem eiusdem nostrae consortis[\s\S]*sine diminutione integraliter devolventur[\s\S]*no\. 38, printed p\. 36 \(scan PDF leaf 93\)/, 'Vytautas Vilnius act'],
    [/Praeterea praedictis libertatibus, privilegiis et gratiis[\s\S]*non scismatici vel alii infideles[\s\S]*no\. 51, section 13, printed p\. 68 \(scan PDF page 125\)/, 'Horodło no. 51'],
    [/Terrestrium regnorum et principatuum ordinem[\s\S]*salvum et incolume diu permanere non possit[\s\S]*no\. 79, printed p\. 135 \(scan PDF leaf 192\)/, 'Mielnik act'],
    [/Quamquam innumere pestes[\s\S]*hec tamen quatuor \(meo iudicio\)[\s\S]*vt nemo ita esse nesciat[\s\S]*non vno impetu simul[\s\S]*printed p\. 33[\s\S]*Prowe/, 'Copernicus monetary memorandum'],
    [/\[…\] praesentibus litteris nostris iam exnunc[\s\S]*inserimus et invisceramus temporibus perpetuis, \[…\][\s\S]*no\. 97, printed p\. 199 \(scan PDF leaf 256\)/, 'Podlasie incorporation'],
    [/A już tę przerzeczoną Ziemię wołyńską[\s\S]*wojewostwo wołyńskie i bracławskie[\s\S]*jako rownych do rownych, wolnych do wolnych ludzi[\s\S]*ku pirwszemu[\s\S]*no\. 136, printed p\. 302 \(scan PDF leaf 359\)/, 'Volhynia and Bratslav incorporation'],
    [/Iż już Królestwo polskie i Wielkie Księstwo litewskie[\s\S]*jedna spolna Rzeczpospolita[\s\S]*państw i narodow[\s\S]*zniosła i spoiła[\s\S]*no\. 148, article 3, printed p\. 343 \(scan PDF leaf 400\)/, 'Union of Lublin Crown act'],
  ],
};

const requiredTopics = {
  'chapter-1-companion.html': ['ethnogenesis', 'enslaved people', 'Dagome iudex', 'Congress of Gniezno'],
  'chapter-2-companion.html': ['seniorate', 'Ostsiedlung', 'Kalisz', 'Legnica', 'Teutonic Order', 'Pomerelia', 'Ruthenia', 'Koszyce', 'Krewo'],
  'chapter-3-companion.html': ['Krewo', 'Vorskla', 'Grunwald', 'Horodło', 'Varna', 'Thirteen Years’ War', 'Mielnik', 'Nihil Novi', 'Lithuanian Statute', 'folwark', 'Copernicus', 'Reformation', 'Livonian War', 'Podlasie', 'Volhynia', 'Lublin'],
};

const chapter3SourceBlocks = {
  'excerpt-krewo': [
    [/Nos Jagalo, virtute Dei dux magnus Litwanorum/, 'audited original'],
    [/We, Jagiełło, by the power of God grand duke of the Lithuanians/, 'translation'],
    [/no\. 1, printed p\. 1 \(scan PDF leaf 58\)/, 'edition locator'],
  ],
  'excerpt-vilnius': [
    [/quae etiam bona post mortem eiusdem nostrae consortis[\s\S]*devolventur/, 'audited original'],
    [/Those goods, after the death of that same, our consort[\s\S]*shall pass in their entirety/, 'translation'],
    [/original-and-copy inventory was not independently collated[\s\S]*no\. 38, printed p\. 36/, 'transmission limit and locator'],
  ],
  'excerpt-horodlo': [
    [/Praeterea praedictis libertatibus[\s\S]*non scismatici vel alii infideles/, 'audited original'],
    [/Moreover, only those barons and nobles[\s\S]*worshippers of the Christian religion subject to the Roman Church/, 'translation'],
    [/printed main text of one named act, no\. 51[\s\S]*surviving-witness inventory was not independently collated/, 'edition and transmission limit'],
  ],
  'excerpt-mielnik': [
    [/Terrestrium regnorum et principatuum ordinem[\s\S]*non possit, \[…\]/, 'audited original with terminal omission'],
    [/It is established that the order of earthly kingdoms[\s\S]*remain safe and unimpaired, \[…\]/, 'translation with terminal omission'],
    [/no\. 79, printed p\. 135 \(scan PDF leaf 192\)/, 'edition locator'],
  ],
  'excerpt-copernicus': [
    [/Quamquam innumere pestes[\s\S]*non vno impetu simul/, 'Prowe original'],
    [/Although the afflictions by which kingdoms[\s\S]*not all at once in a single assault/, 'translation'],
    [/Leopold Prowe[\s\S]*printed p\. 33[\s\S]*edited manuscript-based text/, 'Prowe base and locator'],
  ],
  'excerpt-podlasie': [
    [/\[…\] praesentibus litteris nostris[\s\S]*temporibus perpetuis, \[…\]/, 'audited original with omission markers'],
    [/\[…\] by these present letters[\s\S]*one indivisible body, \[…\]/, 'translation with omission markers'],
    [/prefatory witness inventory was not independently collated[\s\S]*no\. 97, printed p\. 199/, 'transmission limit and locator'],
  ],
  'excerpt-volhynia': [
    [/A już tę przerzeczoną Ziemię wołyńską[\s\S]*bracławskie, \[…\] ku Królestwu[\s\S]*ku pirwszemu[\s\S]*głowie \[…\]/, 'audited original with internal and terminal omissions'],
    [/And now the aforesaid land of Volhynia[\s\S]*Bratslav, \[…\] \[we join\][\s\S]*body and head \[…\]/, 'translation with supplied text and omission markers'],
    [/original-and-copy inventory was not independently collated[\s\S]*no\. 136, printed p\. 302/, 'transmission limit and locator'],
  ],
  'excerpt-lublin': [
    [/Iż już Królestwo polskie[\s\S]*jedna spolna Rzeczpospolita[\s\S]*państw i narodow[\s\S]*zniosła i spoiła/, 'audited original'],
    [/That now the Kingdom of Poland[\s\S]*one common Commonwealth[\s\S]*joined into one people/, 'translation'],
    [/printed main text of no\. 148[\s\S]*original-and-copy inventory was not independently collated[\s\S]*printed p\. 343/, 'edition, transmission limit and locator'],
  ],
};

let totalWords = 0;
for (const file of companionFiles) {
  const path = `public/${file}`;
  const html = readFileSync(path, 'utf8');
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:[a-z]+|#\d+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text.split(/\s+/).filter(Boolean);
  totalWords += words.length;

  assert(/<title>[^<]+Chapter \d+ Companion<\/title>/i.test(html), `${file} needs a descriptive chapter-companion title`);
  assert(/<main\b/i.test(html) && /<nav\b/i.test(html), `${file} needs semantic main and navigation landmarks`);
  assert(/href="\.\/history-companion\.css"/.test(html), `${file} must use the shared relative stylesheet`);
  assert(words.length >= 7500, `${file} is too short: ${words.length} words; expected at least 7,500`);
  assert(count(html, /<section\b[^>]*class="[^"]*companion-section/g) >= 18, `${file} needs at least 18 print-oriented major sections`);
  for (const table of html.match(/<table\b[^>]*class="[^"]*timeline-table[^"]*"[^>]*>[\s\S]*?<\/table>/g) || []) {
    assert(/<caption\b/.test(table), `${file} timeline tables need captions`);
    assert(!/<th(?![^>]*scope="row")/g.test(table), `${file} timeline row headers need scope="row"`);
  }
  const figures = html.match(/<figure\b[\s\S]*?<\/figure>/g) || [];
  const excerpts = html.match(/<blockquote\b[^>]*class="[^"]*source-excerpt[^"]*"[^>]*>[\s\S]*?<\/blockquote>/g) || [];
  assert(figures.length >= 10, `${file} needs at least 10 contextual figures`);
  assert(count(html, /<figure\b[^>]*data-kind="map"/g) >= 2, `${file} needs at least 2 historically contextualized maps`);
  assert(excerpts.length >= 8, `${file} needs at least 8 primary-source excerpts`);
  for (const excerpt of excerpts) {
    assert(/class="source-original"/.test(excerpt), `${file} has a source excerpt without original text`);
    assert(/class="source-translation"/.test(excerpt), `${file} has a source excerpt without a translation`);
    assert(/class="source-citation"/.test(excerpt), `${file} has a source excerpt without a precise citation`);
    assert(/<a\b[^>]*href="https?:\/\//.test(excerpt), `${file} has a source excerpt without a retrievable source link`);
  }
  assert(count(html, /class="[^"]*interpretation/g) >= 6, `${file} needs explicit competing-interpretation discussions`);
  assert(count(html, /<li\b[^>]*class="[^"]*bibliography-entry/g) >= 25, `${file} needs at least 25 further-reading entries`);
  for (const figure of figures) {
    assert(/class="figure-meta"/.test(figure), `${file} has a figure without provenance and licence metadata`);
    assert(/commons\.wikimedia\.org\/wiki\/File:/.test(figure), `${file} has a figure without a Wikimedia Commons file-record link`);
  }

  for (const [pattern, source] of auditAnchors[file] || []) {
    assert(pattern.test(html), `${file}: ${source} excerpt must retain its audited witness and citation`);
  }
  for (const topic of requiredTopics[file] || []) {
    assert(text.toLocaleLowerCase('en').includes(topic.toLocaleLowerCase('en')), `${file} missing required topic: ${topic}`);
  }

  for (const tag of html.match(/<img\b[^>]*>/g) || []) {
    const alt = tag.match(/\balt="([^"]*)"/)?.[1] || '';
    assert(alt.trim().length >= 40, `${file} figure alt text is missing or too short: ${tag.slice(0, 100)}`);
    assert(/loading="lazy"/.test(tag), `${file} companion images must lazy-load`);
  }
  assert(!/lorem ipsum/i.test(text), `${file} contains placeholder prose`);
  if (file === 'chapter-3-companion.html') {
    assert(html.includes('<title>A Union Made and Remade — Chapter 3 Companion</title>'), `${file} must retain its publication title`);
    assert(words.length >= 9500 && words.length <= 11500, `${file} must contain 9,500–11,500 words; found ${words.length}`);
    assert(count(html, /<p class="section-number">\d{2} ·/g) >= 21 && count(html, /<p class="section-number">\d{2} ·/g) <= 22, `${file} needs 21–22 numbered sections`);
    assert(figures.length === 10, `${file} needs exactly 10 recommended Commons figures`);
    assert(count(html, /<figure\b[^>]*data-kind="map"/g) === 2, `${file} needs exactly 2 maps`);
    assert(excerpts.length === 8, `${file} needs exactly 8 audited primary-source excerpts`);
    for (const [id, checks] of Object.entries(chapter3SourceBlocks)) {
      const block = html.match(new RegExp(`<blockquote\\b[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?<\\/blockquote>`))?.[0];
      assert(block, `${file} is missing source block #${id}`);
      for (const [pattern, label] of checks) {
        assert(pattern.test(block), `${file} #${id} must retain its ${label} inside the same source block`);
      }
    }
    assert(/Nicolaus Copernicus, <em>Monete cudende ratio<\/em>[\s\S]*Leopold Prowe[\s\S]*1884[\s\S]*p\. 33/.test(html), `${file} bibliography must identify Prowe 1884 as the Copernicus textual base`);
    assert(!/Wołowski|Wołowski monetary text|Wolowski/.test(html), `${file} must not identify the superseded Wołowski text as its Copernicus base`);
    for (const tag of html.match(/<img\b[^>]*>/g) || []) {
      assert(/\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag), `${file} images need intrinsic dimensions to prevent layout shift`);
    }
    assert(/spoiła\.<\/p>/.test(html) && !/spoiliła/.test(html), `${file} must preserve the scan's Lublin reading spoiła, not the OCR error spoiliła`);
    assert(/href:\s*['"]\.\/chapter-3-companion\.html['"]/.test(readFileSync('src/curriculum.js', 'utf8')), 'jagiellonian-union curriculum metadata must link Chapter 3');
  }
  console.log(`${file}: ${words.length} words, ${count(html, /<section\b[^>]*class="[^"]*companion-section/g)} sections, ${count(html, /<figure\b/g)} figures, ${count(html, /<blockquote\b[^>]*class="[^"]*source-excerpt/g)} source excerpts`);
}

assert(/@page\s*{[^}]*size:\s*A4/i.test(css), 'shared print stylesheet must define A4 pages');
assert(/@media\s+print/i.test(css), 'shared companion stylesheet needs print-specific rules');
assert(/:focus-visible/.test(css), 'shared companion stylesheet needs visible keyboard focus');
console.log(`companion verification passed: ${companionFiles.length} readers, ${totalWords} words`);
