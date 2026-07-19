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
};

const requiredTopics = {
  'chapter-1-companion.html': ['ethnogenesis', 'enslaved people', 'Dagome iudex', 'Congress of Gniezno'],
  'chapter-2-companion.html': ['seniorate', 'Ostsiedlung', 'Kalisz', 'Legnica', 'Teutonic Order', 'Pomerelia', 'Ruthenia', 'Koszyce', 'Krewo'],
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
  console.log(`${file}: ${words.length} words, ${count(html, /<section\b[^>]*class="[^"]*companion-section/g)} sections, ${count(html, /<figure\b/g)} figures, ${count(html, /<blockquote\b[^>]*class="[^"]*source-excerpt/g)} source excerpts`);
}

assert(/@page\s*{[^}]*size:\s*A4/i.test(css), 'shared print stylesheet must define A4 pages');
assert(/@media\s+print/i.test(css), 'shared companion stylesheet needs print-specific rules');
assert(/:focus-visible/.test(css), 'shared companion stylesheet needs visible keyboard focus');
console.log(`companion verification passed: ${companionFiles.length} readers, ${totalWords} words`);
