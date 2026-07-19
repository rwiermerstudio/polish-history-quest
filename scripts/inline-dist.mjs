import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const out = 'dist-k8s';
const index = readFileSync(join(dist, 'index.html'), 'utf8');
let html = index;
let stylesheetCount = 0;
let moduleCount = 0;
html = html.replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/g, (_, href) => {
  stylesheetCount += 1;
  const css = readFileSync(join(dist, href), 'utf8');
  return `<style>\n${css}\n</style>`;
});
html = html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g, (_, src) => {
  moduleCount += 1;
  const js = readFileSync(join(dist, src), 'utf8');
  return `<script type="module">\n${js}\n</script>`;
});
if (stylesheetCount !== 1 || moduleCount !== 1) {
  throw new Error(`expected to inline 1 stylesheet and 1 module, inlined ${stylesheetCount} stylesheet(s) and ${moduleCount} module(s)`);
}
if (/(?:href|src)="\.?\/?assets\//.test(html)) {
  throw new Error('Kubernetes index still contains an unmounted assets/ reference after inlining');
}
if (!/<style>[\s\S]+<\/style>/.test(html) || !/<script type="module">[\s\S]+<\/script>/.test(html)) {
  throw new Error('Kubernetes index is missing its inlined stylesheet or module');
}
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'index.html'), html);

const companionFiles = readdirSync(dist).filter(file =>
  /^chapter-\d+-companion\.html$/.test(file) || file === 'history-companion.css');
for (const file of companionFiles) copyFileSync(join(dist, file), join(out, file));
console.log(`wrote ${join(out, 'index.html')} (${html.length} bytes) and ${companionFiles.length} companion assets`);
