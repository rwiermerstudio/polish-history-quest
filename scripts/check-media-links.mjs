import { chapters } from '../src/curriculum.js';

const items = chapters.flatMap(chapter => chapter.media.map(item => ({ chapter: chapter.id, ...item })));
const titleToItem = new Map(items.map(item => [`File:${decodeURIComponent(item.source.split('File:')[1])}`, item]));
const params = new URLSearchParams({
  action: 'query',
  titles: [...titleToItem.keys()].join('|'),
  prop: 'imageinfo',
  iiprop: 'url|mime|mediatype|extmetadata',
  format: 'json',
  formatversion: '2',
});

const endpoint = `https://commons.wikimedia.org/w/api.php?${params}`;
async function fetchCommons(attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        headers: { 'user-agent': 'PolishHistoryQuest/0.4 media-validation' },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`Wikimedia Commons API returned HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, attempt * 1500));
    }
  }
  throw new Error(`Wikimedia Commons media check failed after ${attempts} attempts: ${lastError?.message || lastError}`);
}

const response = await fetchCommons();
const payload = await response.json();
const failures = [];
const seen = new Set();

for (const page of payload.query?.pages || []) {
  const item = titleToItem.get(page.title);
  if (!item) continue;
  seen.add(page.title);
  if (page.missing || !page.imageinfo?.[0]) {
    failures.push(`${item.chapter}/${item.id}: missing Commons file ${page.title}`);
    continue;
  }
  const info = page.imageinfo[0];
  const remoteLicense = info.extmetadata?.LicenseShortName?.value || '';
  if (remoteLicense.toLocaleLowerCase('en') !== item.license.toLocaleLowerCase('en')) {
    failures.push(`${item.chapter}/${item.id}: configured licence “${item.license}” differs from Commons “${remoteLicense}”`);
  }
  const mimeMatches = item.type === 'audio'
    ? /^audio\//.test(info.mime || '') || info.mime === 'application/ogg'
    : item.type === 'video'
      ? /^video\//.test(info.mime || '')
      : /^image\//.test(info.mime || '');
  if (!mimeMatches) {
    failures.push(`${item.chapter}/${item.id}: configured type “${item.type}” differs from Commons MIME “${info.mime || 'unknown'}”`);
  }
}

for (const [title, item] of titleToItem) {
  if (!seen.has(title)) failures.push(`${item.chapter}/${item.id}: no API result for ${title}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`media verification passed: ${items.length} Commons files reachable with matching licence metadata`);
