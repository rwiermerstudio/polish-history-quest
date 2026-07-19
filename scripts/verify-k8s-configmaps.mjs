import { readFileSync, readdirSync } from 'node:fs';

const manifest = readFileSync('k8s/generated/site-configmap.yaml', 'utf8');
const deployment = readFileSync('k8s/deployment.yaml', 'utf8');
const companions = readdirSync('dist-k8s')
  .filter(file => /^chapter-\d+-companion\.html$/.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const documents = manifest.split(/\n---\n/);
assert(documents.length === companions.length + 1, `expected ${companions.length + 1} ConfigMap documents, found ${documents.length}`);
assert(/name: polish-history-site\b/.test(documents[0]), 'first ConfigMap must contain the base site');
assert(documents[0].includes('index.html:') && documents[0].includes('history-companion.css:'), 'base ConfigMap must contain index and shared companion CSS');

for (const file of companions) {
  const number = file.match(/^chapter-(\d+)-/)?.[1];
  const configName = `polish-history-companion-${number}`;
  const document = documents.find(item => item.includes(`name: ${configName}\n`));
  assert(document, `${file} is missing ConfigMap ${configName}`);
  assert(document.includes(`${file}: |`), `${configName} does not contain ${file}`);
  assert(document.includes(`namespace: polish-history-quest`), `${configName} has the wrong namespace`);
  const escapedName = configName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert(new RegExp(`name:\\s*${escapedName}(?:\\s|,|})`).test(deployment), `deployment projected volume is missing ${configName}`);
  assert(new RegExp(`name:\\s*${escapedName}(?:\\s|})`).test(deployment), `${configName} must be required after publication`);
}

for (const [index, document] of documents.entries()) {
  const bytes = Buffer.byteLength(document);
  assert(bytes < 900_000, `ConfigMap document ${index + 1} is too large: ${bytes} bytes`);
}
assert(/projected:\s*\n\s+sources:/m.test(deployment), 'deployment must use a projected ConfigMap volume');
console.log(`split Kubernetes companion verification passed: ${companions.length} companions, ${documents.length} ConfigMaps`);
