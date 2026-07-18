import { readFileSync } from 'node:fs';

const main = readFileSync('src/main.js', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const requirements = [
  ['curriculum import', /from ['"]\.\/curriculum\.js['"]/],
  ['chapter section renderer', /function renderChapterSections\s*\(/],
  ['multi-question quiz renderer', /function renderChapterQuiz\s*\(/],
  ['chapter completion guard', /answeredQuestions/],
  ['legacy progress migration', /legacyProgressMap/],
  ['section navigation', /chapterSectionIndex/],
  ['question navigation', /chapterQuestionIndex/],
  ['deterministic option shuffling', /function displayedQuestionOptions\s*\(/],
  ['actor rendering', /chapter\.actors/],
  ['chapter media renderer', /function renderChapterMedia\s*\(/],
  ['lazy image loading', /loading="lazy"/],
  ['native audio controls', /<audio[^>]+controls/],
  ['native video controls', /<video[^>]+controls/],
  ['audio deferred loading', /<audio[^>]+preload="none"/],
  ['video metadata-only loading', /<video[^>]+preload="metadata"/],
  ['audiovisual text alternative', /media-transcript[\s\S]*?textAlternative/],
  ['media source and licence', /item\.source[\s\S]*?item\.license/],
  ['quiz coverage reference', /item\.coverage/],
  ['modal focus trap', /function handleDocumentKeydown[\s\S]*?event\.key !== 'Tab'[\s\S]*?last\.focus\(\)/],
  ['modal background inert', /setModalBackgroundInert\(true\)/],
  ['modal focus restoration', /lastModalTrigger\?\.focus\(\)/],
  ['cultural section label', /Cultural artifact|Culture and memory/],
  ['complete game-session reset', /function resetGameSession\s*\([\s\S]*?resetGameSession\(\);[\s\S]*?renderAll\(\);/],
];
if (/autoplay/i.test(main)) {
  console.error('Chapter media must never autoplay');
  process.exit(1);
}
if (/primary-source sound/i.test(main)) {
  console.error('Audio must be labelled by its actual evidentiary status, not globally as a primary source');
  process.exit(1);
}
let failed = false;
for (const [label, pattern] of requirements) {
  if (!pattern.test(main)) {
    console.error(`Missing ${label}`);
    failed = true;
  }
}
for (const selector of ['.chapter-reader', '.chapter-section', '.chapter-media', '.media-card', '.actor-grid', '.quiz-progress', '.quiz-coverage', '.section-nav', ':focus-visible', 'prefers-reduced-motion']) {
  if (!css.includes(selector)) {
    console.error(`Missing CSS selector ${selector}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('learning UI verification passed');
