import { readFileSync, existsSync } from 'node:fs';
const checks = [
  ['index.html', '<script type="module" src="/src/main.js"></script>'],
  ['index.html', 'rel="icon"'],
  ['src/main.js', 'localStorage'],
  ['src/main.js', 'answeredQuestions'],
  ['src/main.js', 'Solidarity'],
  ['src/main.js', 'Chronicle Forge'],
  ['src/main.js', 'Commonwealth Council'],
  ['src/main.js', 'Archive Casefiles'],
  ['src/curriculum.js', 'Polish-Lithuanian Commonwealth'],
  ['src/curriculum.js', 'Warsaw Ghetto Uprising'],
  ['src/styles.css', '--crimson'],
  ['docs/IMPLEMENTATION_PLAN.md', 'Learning outcomes'],
];
let ok = true;
for (const [file, phrase] of checks) {
  if (!existsSync(file)) { console.error(`Missing ${file}`); ok = false; continue; }
  const txt = readFileSync(file, 'utf8');
  if (!txt.includes(phrase)) { console.error(`Missing phrase in ${file}: ${phrase}`); ok = false; }
}
const curriculum = readFileSync('src/curriculum.js','utf8');
const chapterRecords = (curriculum.match(/id: '/g) || []).length;
if (chapterRecords < 13) { console.error(`Expected at least 13 chapter records, got ${chapterRecords}`); ok = false; }
if (!ok) process.exit(1);
console.log('content verification passed');
