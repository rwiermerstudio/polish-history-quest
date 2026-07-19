import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const [inputArg, outputArg] = process.argv.slice(2);
if (!inputArg || !outputArg) {
  console.error('usage: node scripts/create-print-fixture.mjs public/chapter-N-companion.html /tmp/chapter-N-print.html');
  process.exit(2);
}

const input = resolve(inputArg);
const output = resolve(outputArg);
const stylesheet = resolve('public/history-companion.css');
const placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%221200%22 viewBox=%220 0 800 1200%22%3E%3Crect width=%22800%22 height=%221200%22 fill=%22%23eee8dc%22/%3E%3Cpath d=%22M0 0L800 1200M800 0L0 1200%22 stroke=%22%23d8c8ad%22 stroke-width=%2212%22/%3E%3C/svg%3E';

let html = readFileSync(input, 'utf8');
html = html.replace(/(<img\b[^>]*?\bsrc=")[^"]+("[^>]*>)/gi, `$1${placeholder}$2`);
writeFileSync(output, html);
const css = readFileSync(stylesheet, 'utf8')
  .replace(/--cover-image:\s*url\([^;]+\)/g, `--cover-image: url('${placeholder}')`);
writeFileSync(join(dirname(output), basename(stylesheet)), css);
console.log(`wrote deterministic print fixture ${output}`);
