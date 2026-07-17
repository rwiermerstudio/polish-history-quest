import { readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
if (/\b(?:src|href)="\/assets\//.test(html)) {
  throw new Error('Vite build contains root-relative asset paths and is not safe under a URL subpath');
}
if (!/\b(?:src|href)="\.\/assets\//.test(html)) {
  throw new Error('Vite build does not contain expected relative asset paths');
}
console.log('subpath-safe static build verification passed');
