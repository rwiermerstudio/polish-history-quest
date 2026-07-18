import { existsSync, readFileSync } from 'node:fs';

const htmlPath = 'public/chapter-1-companion.html';
const cssPath = 'public/chapter-1-companion.css';
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(existsSync(htmlPath), `missing ${htmlPath}`);
assert(existsSync(cssPath), `missing ${cssPath}`);

const html = readFileSync(htmlPath, 'utf8');
const css = readFileSync(cssPath, 'utf8');
const text = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(?:[a-z]+|#\d+);/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const words = text.split(/\s+/).filter(Boolean);
const count = pattern => (html.match(pattern) || []).length;

assert(/<title>[^<]*Before Poland[^<]*<\/title>/i.test(html), 'companion needs a descriptive title');
assert(/<main\b/i.test(html) && /<nav\b/i.test(html), 'companion needs semantic main and navigation landmarks');
assert(/href="\.\/chapter-1-companion\.css"/.test(html), 'companion must use the dedicated relative stylesheet');
assert(words.length >= 7500, `companion is too short: ${words.length} words; expected at least 7,500`);
assert(count(/<section\b[^>]*class="[^"]*companion-section/g) >= 18, 'companion needs at least 18 print-oriented major sections');
assert(count(/<figure\b/g) >= 8, 'companion needs at least 8 contextual figures');
assert(count(/<figure\b[^>]*data-kind="map"/g) >= 2, 'companion needs at least 2 historically contextualized maps');
assert(count(/<blockquote\b[^>]*class="[^"]*source-excerpt/g) >= 6, 'companion needs at least 6 primary-source excerpts');
assert(count(/class="source-original"/g) >= 6 && count(/class="source-translation"/g) >= 6, 'every excerpt needs original text and a translation');
assert(count(/class="[^"]*interpretation/g) >= 6, 'companion needs explicit competing-interpretation discussions');
assert(count(/<li\b[^>]*class="[^"]*bibliography-entry/g) >= 25, 'companion needs at least 25 further-reading entries');
assert(count(/class="figure-meta"/g) >= 8, 'every figure needs provenance and licence metadata');
assert(count(/commons\.wikimedia\.org\/wiki\/File:/g) >= 8, 'figure source records must link to Wikimedia Commons file pages');
assert(count(/class="source-citation"/g) >= 6, 'every primary-source excerpt needs a precise citation');

for (const [pattern, source] of [
  [/Misacam regem,[\s\S]*duabus vicibus superavit/, 'Widukind'],
  [/Misicam et Lambertus[\s\S]*Victor Wolf von Glanvell/, 'Dagome iudex'],
  [/Laurentian recension, entry 6489 \(981\)[\s\S]*psrl_tom01/, 'Primary Chronicle'],
  [/Quae regio, quamvis multum sit nemorosa[\s\S]*page\/425/, 'Gallus prologue'],
]) assert(pattern.test(html), `${source} excerpt must retain its audited witness and citation`);

const imageTags = html.match(/<img\b[^>]*>/g) || [];
for (const tag of imageTags) {
  const alt = tag.match(/\balt="([^"]*)"/)?.[1] || '';
  assert(alt.trim().length >= 40, `figure alt text is missing or too short: ${tag.slice(0, 100)}`);
  assert(/loading="lazy"/.test(tag), 'companion images must lazy-load');
}

for (const topic of ['ethnogenesis', 'enslaved people', 'Dagome iudex', 'Congress of Gniezno']) {
  assert(text.toLocaleLowerCase('en').includes(topic.toLocaleLowerCase('en')), `companion missing required topic: ${topic}`);
}
assert(/@page\s*{[^}]*size:\s*A4/i.test(css), 'print stylesheet must define A4 pages');
assert(/@media\s+print/i.test(css), 'companion needs print-specific rules');
assert(/:focus-visible/.test(css), 'companion needs visible keyboard focus');
assert(!/lorem ipsum/i.test(text), 'placeholder prose remains in companion');

console.log(`chapter 1 companion verification passed: ${words.length} words, ${count(/<section\b[^>]*class="[^"]*companion-section/g)} sections, ${count(/<figure\b/g)} figures, ${count(/<blockquote\b[^>]*class="[^"]*source-excerpt/g)} source excerpts`);
