import { existsSync, readFileSync, readdirSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
if (/\b(?:src|href)="\/assets\//.test(html)) {
  throw new Error('Vite build contains root-relative asset paths and is not safe under a URL subpath');
}
if (!/\b(?:src|href)="\.\/assets\//.test(html)) {
  throw new Error('Vite build does not contain expected relative asset paths');
}

const companions = readdirSync('public')
  .filter(file => /^chapter-\d+-companion\.html$/.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
for (const file of ['history-companion.css', ...companions]) {
  const path = `dist/${file}`;
  if (!existsSync(path)) throw new Error(`Vite build is missing companion asset: ${path}`);
}
for (const file of companions) {
  const companion = readFileSync(`dist/${file}`, 'utf8');
  if (!companion.includes('href="./history-companion.css"') || !companion.includes('href="./"')) {
    throw new Error(`${file} must keep portable relative links`);
  }
}
console.log(`subpath-safe static build verification passed: ${companions.length} companions`);
