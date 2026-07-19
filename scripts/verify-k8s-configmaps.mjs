import { readFileSync, readdirSync } from 'node:fs';
import { parseAllDocuments } from 'yaml';

const manifestPath = process.argv[2] || 'k8s/generated/site-configmap.yaml';
const manifest = readFileSync(manifestPath, 'utf8');
const deployment = readFileSync('k8s/deployment.yaml', 'utf8');
const companions = readdirSync('dist-k8s')
  .filter(file => /^chapter-\d+-companion\.html$/.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const documents = parseAllDocuments(manifest);
assert(documents.length === companions.length + 1, `expected ${companions.length + 1} ConfigMap documents, found ${documents.length}`);
const configMaps = new Map();
for (const document of documents) {
  assert(document.errors.length === 0, `invalid ConfigMap YAML: ${document.errors.join('; ')}`);
  const configMap = document.toJS();
  const name = configMap?.metadata?.name;
  assert(name, 'ConfigMap document has no metadata.name');
  assert(configMap.kind === 'ConfigMap', `${name} must be a ConfigMap`);
  assert(configMap.metadata.namespace === 'polish-history-quest', `${name} has the wrong namespace`);
  assert(!configMaps.has(name), `duplicate ConfigMap ${name}`);
  configMaps.set(name, configMap);
}

const expectedFiles = new Map([
  ['polish-history-site', ['index.html', 'history-companion.css']],
]);
for (const file of companions) {
  const number = file.match(/^chapter-(\d+)-/)?.[1];
  expectedFiles.set(`polish-history-companion-${number}`, [file]);
}

assert(configMaps.size === expectedFiles.size, `expected ${expectedFiles.size} ConfigMaps, found ${configMaps.size}`);
for (const [configName, files] of expectedFiles) {
  const configMap = configMaps.get(configName);
  assert(configMap, `missing ConfigMap ${configName}`);
  const data = configMap.data || {};
  assert(Object.keys(data).length === files.length, `${configName} must contain exactly ${files.join(', ')}`);
  for (const file of files) {
    assert(Object.hasOwn(data, file), `${configName} does not contain ${file}`);
    const expected = readFileSync(`dist-k8s/${file}`, 'utf8');
    assert(data[file] === expected, `${configName}/${file} is stale: regenerate from dist-k8s`);
  }
  if (configName !== 'polish-history-site') {
    const escapedName = configName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert(new RegExp(`name:\\s*${escapedName}(?:\\s|,|})`).test(deployment), `deployment projected volume is missing ${configName}`);
    assert(new RegExp(`name:\\s*${escapedName}(?:\\s|})`).test(deployment), `${configName} must be required after publication`);
  }
}

for (const [index, document] of manifest.split(/\n---\n/).entries()) {
  const bytes = Buffer.byteLength(document);
  assert(bytes < 900_000, `ConfigMap document ${index + 1} is too large: ${bytes} bytes`);
}
assert(/projected:\s*\n\s+sources:/m.test(deployment), 'deployment must use a projected ConfigMap volume');
console.log(`split Kubernetes companion verification passed: ${companions.length} companions, ${documents.length} exact ConfigMaps`);
