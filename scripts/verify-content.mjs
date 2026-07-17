import { readFileSync, existsSync } from 'node:fs';
const checks = [
  ['index.html', '<script type="module" src="/src/main.js"></script>'],
  ['src/main.js', 'localStorage'],
  ['src/main.js', 'Polish-Lithuanian Commonwealth'],
  ['src/main.js', 'Solidarity'],
  ['src/main.js', 'Partition puzzle'],
  ['src/styles.css', '--crimson'],
  ['docs/IMPLEMENTATION_PLAN.md', 'Learning outcomes'],
];
let ok = true;
for (const [file, phrase] of checks) {
  if (!existsSync(file)) { console.error(`Missing ${file}`); ok = false; continue; }
  const txt = readFileSync(file, 'utf8');
  if (!txt.includes(phrase)) { console.error(`Missing phrase in ${file}: ${phrase}`); ok = false; }
}
const js = readFileSync('src/main.js','utf8');
const eras = (js.match(/id:'/g) || []).length;
if (eras < 6) { console.error(`Expected at least 6 era records, got ${eras}`); ok = false; }
if (!ok) process.exit(1);
console.log('content verification passed');
