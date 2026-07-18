import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
if (/\b(?:src|href)="\/assets\//.test(html)) {
  throw new Error('Vite build contains root-relative asset paths and is not safe under a URL subpath');
}
if (!/\b(?:src|href)="\.\/assets\//.test(html)) {
  throw new Error('Vite build does not contain expected relative asset paths');
}
for (const path of ['dist/chapter-1-companion.html', 'dist/chapter-1-companion.css']) {
  if (!existsSync(path)) throw new Error(`Vite build is missing companion asset: ${path}`);
}
const companion = readFileSync('dist/chapter-1-companion.html', 'utf8');
if (!companion.includes('href="./chapter-1-companion.css"') || !companion.includes('href="./"')) {
  throw new Error('companion build must keep portable relative links');
}
console.log('subpath-safe static build and companion verification passed');
