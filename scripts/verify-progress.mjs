import { normalizeProgress } from '../src/progress.js';
import { chapters } from '../src/curriculum.js';

const defaults = { completed: {}, answeredQuestions: {}, achievements: {}, legacyCompleted: [], score: 0 };
const legacyMap = { origins: 'lands-before-poland', commonwealth: 'commonwealth', war: 'world-war-two' };

const legacy = normalizeProgress({ completed: { origins: true, commonwealth: true }, score: 80 }, chapters, legacyMap, defaults);
if (Object.keys(legacy.completed).length !== 0) throw new Error('legacy one-question completions must not complete expanded chapters');
if (!legacy.legacyCompleted.includes('lands-before-poland') || !legacy.legacyCompleted.includes('commonwealth')) throw new Error('legacy study credit must be preserved');
if (!legacy.achievements['legacy-learner']) throw new Error('legacy learner achievement missing');

const answers = Object.fromEntries([0, 1, 2, 3].map(index => [index, { choice: 0, correct: true }]));
const modern = normalizeProgress({ completed: { commonwealth: true }, answeredQuestions: { commonwealth: answers } }, chapters, legacyMap, defaults);
if (!modern.completed.commonwealth) throw new Error('expanded completion with four correct answers must persist');
if (modern.legacyCompleted.includes('commonwealth')) throw new Error('modern completion must not be mislabeled as legacy');

const partial = normalizeProgress({ completed: { commonwealth: true }, answeredQuestions: { commonwealth: { 0: { choice: 0, correct: true } } } }, chapters, legacyMap, defaults);
if (partial.completed.commonwealth) throw new Error('partial answers must not produce chapter completion');
const commonwealth = chapters.find(chapter => chapter.id === 'commonwealth');
if (partial.answeredQuestions.commonwealth[0].choice !== commonwealth.quiz[0].answer) throw new Error('stored correct choices must be normalized after deterministic option reordering');

const wrong = normalizeProgress({ answeredQuestions: { commonwealth: { 0: { choice: 2, correct: false } } } }, chapters, legacyMap, defaults);
if (wrong.answeredQuestions.commonwealth?.[0]) throw new Error('persisted wrong answers must be removed so reload restores retry access');

console.log('progress migration verification passed');
