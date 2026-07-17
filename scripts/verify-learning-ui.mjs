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
  ['cultural section label', /Cultural artifact|Culture and memory/],
  ['complete game-session reset', /function resetGameSession\s*\([\s\S]*?resetGameSession\(\);[\s\S]*?renderAll\(\);/],
];
let failed = false;
for (const [label, pattern] of requirements) {
  if (!pattern.test(main)) {
    console.error(`Missing ${label}`);
    failed = true;
  }
}
for (const selector of ['.chapter-reader', '.chapter-section', '.actor-grid', '.quiz-progress', '.section-nav', ':focus-visible', 'prefers-reduced-motion']) {
  if (!css.includes(selector)) {
    console.error(`Missing CSS selector ${selector}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('learning UI verification passed');
