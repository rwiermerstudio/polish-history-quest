import { readFileSync } from 'node:fs';

const main = readFileSync('src/main.js', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const requirements = [
  ['curriculum import', /from ['"]\.\/curriculum\.js['"]/],
  ['chapter section renderer', /function renderChapterSections\s*\(/],
  ['multi-question quiz renderer', /function renderChapterQuiz\s*\(/],
  ['chapter completion guard', /answeredQuestions/],
  ['section navigation', /chapterSectionIndex/],
  ['question navigation', /chapterQuestionIndex/],
  ['actor rendering', /chapter\.actors/],
  ['cultural section label', /Cultural artifact|Culture and memory/],
];
let failed = false;
for (const [label, pattern] of requirements) {
  if (!pattern.test(main)) {
    console.error(`Missing ${label}`);
    failed = true;
  }
}
for (const selector of ['.chapter-reader', '.chapter-section', '.actor-grid', '.quiz-progress', '.section-nav']) {
  if (!css.includes(selector)) {
    console.error(`Missing CSS selector ${selector}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('learning UI verification passed');
