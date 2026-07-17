import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const dist = 'dist';
const out = 'dist-k8s';
const index = readFileSync(join(dist, 'index.html'), 'utf8');
let html = index;
html = html.replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/g, (_, href) => {
  const css = readFileSync(join(dist, href), 'utf8');
  return `<style>\n${css}\n</style>`;
});
html = html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g, (_, src) => {
  const js = readFileSync(join(dist, src), 'utf8');
  return `<script type="module">\n${js}\n</script>`;
});
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'index.html'), html);
console.log(`wrote ${join(out, 'index.html')} (${html.length} bytes)`);
