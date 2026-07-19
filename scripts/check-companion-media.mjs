import { readFileSync, readdirSync } from 'node:fs';

const files = readdirSync('public')
  .filter(file => /^chapter-\d+-companion\.html$/.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const titleToFiles = new Map();
const imageUrls = [];
const failures = [];

const decodeFilename = value => decodeURIComponent(value).replaceAll('_', ' ');
const titleFromRecord = raw => {
  const url = new URL(raw);
  const marker = '/wiki/File:';
  const index = url.pathname.indexOf(marker);
  return index >= 0 ? `File:${decodeFilename(url.pathname.slice(index + marker.length))}` : null;
};
const titleFromImage = raw => {
  const url = new URL(raw);
  const marker = '/wiki/Special:Redirect/file/';
  const index = url.pathname.indexOf(marker);
  return index >= 0 ? `File:${decodeFilename(url.pathname.slice(index + marker.length))}` : null;
};

for (const file of files) {
  const html = readFileSync(`public/${file}`, 'utf8');
  const figures = html.match(/<figure\b[\s\S]*?<\/figure>/g) || [];
  for (const [index, figure] of figures.entries()) {
    const imageUrl = figure.match(/<img\b[^>]*\bsrc="([^"]+)"/)?.[1];
    const recordUrl = figure.match(/<a\b[^>]*href="(https:\/\/commons\.wikimedia\.org\/wiki\/File:[^"]+)"/)?.[1];
    if (!imageUrl || !recordUrl) {
      failures.push(`${file}: figure ${index + 1} needs both an image URL and a Commons file-record URL`);
      continue;
    }
    const imageTitle = titleFromImage(imageUrl);
    const recordTitle = titleFromRecord(recordUrl);
    if (!imageTitle) failures.push(`${file}: figure ${index + 1} image must use a Commons Special:Redirect/file URL`);
    if (!recordTitle) failures.push(`${file}: figure ${index + 1} has an invalid Commons file-record URL`);
    if (imageTitle && recordTitle && imageTitle !== recordTitle) {
      failures.push(`${file}: figure ${index + 1} image ${imageTitle} does not match record ${recordTitle}`);
    }
    if (recordTitle) {
      if (!titleToFiles.has(recordTitle)) titleToFiles.set(recordTitle, new Set());
      titleToFiles.get(recordTitle).add(file);
    }
    imageUrls.push({ file, index: index + 1, url: imageUrl });
  }
}

const titles = [...titleToFiles.keys()];
const seen = new Set();

async function fetchWithRetries(url, options = {}, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { 'user-agent': 'PolishHistoryQuest/0.7 companion-media-audit', ...options.headers },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.status = response.status;
        error.retryAfter = Number(response.headers.get('retry-after')) || 0;
        throw error;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        const throttleDelay = error.status === 429 ? Math.max(error.retryAfter * 1000, attempt * 5000) : attempt * 1500;
        await new Promise(resolve => setTimeout(resolve, throttleDelay));
      }
    }
  }
  throw new Error(`failed after ${attempts} attempts: ${lastError?.message || lastError}`);
}

async function fetchBatch(batch) {
  const params = new URLSearchParams({
    action: 'query',
    titles: batch.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    format: 'json',
    formatversion: '2',
  });
  const response = await fetchWithRetries(`https://commons.wikimedia.org/w/api.php?${params}`);
  return response.json();
}

for (let index = 0; index < titles.length; index += 40) {
  const payload = await fetchBatch(titles.slice(index, index + 40));
  for (const page of payload.query?.pages || []) {
    seen.add(page.title);
    const owners = titleToFiles.get(page.title) || new Set();
    if (page.missing || !page.imageinfo?.[0]) {
      failures.push(`${[...owners].join(', ') || 'unknown reader'}: missing ${page.title}`);
      continue;
    }
    const info = page.imageinfo[0];
    const license = info.extmetadata?.LicenseShortName?.value || '';
    if (!license) failures.push(`${page.title}: Commons has no machine-readable licence`);
    if (!/^image\//.test(info.mime || '')) failures.push(`${page.title}: expected image MIME, got ${info.mime || 'unknown'}`);
  }
}

for (const [title, owners] of titleToFiles) {
  if (!seen.has(title)) failures.push(`${[...owners].join(', ')}: no API result for ${title}`);
}

for (const image of imageUrls) {
  try {
    const response = await fetchWithRetries(image.url, {
      method: 'HEAD',
      headers: { accept: 'image/avif,image/webp,image/*,*/*;q=0.8' },
    });
    if (!/^image\//.test(response.headers.get('content-type') || '')) {
      failures.push(`${image.file}: figure ${image.index} resolved to a non-image response`);
    }
  } catch (error) {
    failures.push(`${image.file}: figure ${image.index} image URL is unavailable (${error.message})`);
  }
  // Commons throttles bursts of Special:Redirect checks more aggressively than API metadata calls.
  await new Promise(resolve => setTimeout(resolve, 1500));
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`companion media audit passed: ${titles.length} matched and reachable Commons images across ${files.length} readers`);
