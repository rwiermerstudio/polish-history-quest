import { chapters, timelineEvents, memoryPairs } from '../src/curriculum.js';

const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };

assert(Array.isArray(chapters), 'chapters must be an array');
assert(chapters.length >= 12, `expected at least 12 chapters, got ${chapters.length}`);
assert(chapters[0].startYear <= 966, 'curriculum must begin no later than 966');
assert(chapters.at(-1).endYear >= 2004, 'curriculum must reach contemporary democratic Poland');

const chapterIds = new Set();
let sectionCount = 0;
let questionCount = 0;
let actorCount = 0;
let curriculumWordCount = 0;
const requiredSectionKinds = new Set(['context', 'events', 'actors', 'international', 'society', 'culture']);
for (const chapter of chapters) {
  assert(chapter.id && !chapterIds.has(chapter.id), `duplicate or missing chapter id: ${chapter.id}`);
  chapterIds.add(chapter.id);
  assert(chapter.title && chapter.years && chapter.summary, `${chapter.id}: missing title, years or summary`);
  curriculumWordCount += [chapter.summary, chapter.key].join(' ').trim().split(/\s+/).length;
  assert(Number.isFinite(chapter.startYear) && Number.isFinite(chapter.endYear), `${chapter.id}: invalid year bounds`);
  assert(chapter.startYear <= chapter.endYear, `${chapter.id}: inverted year bounds`);
  assert(Array.isArray(chapter.sections) && chapter.sections.length >= 3, `${chapter.id}: expected at least 3 sections`);
  sectionCount += chapter.sections.length;
  const kinds = new Set(chapter.sections.map(section => section.kind));
  assert(kinds.has('context'), `${chapter.id}: missing context section`);
  assert(kinds.has('international'), `${chapter.id}: missing international context`);
  assert(kinds.has('culture'), `${chapter.id}: missing culture/artifact section`);
  for (const section of chapter.sections) {
    assert(requiredSectionKinds.has(section.kind), `${chapter.id}: unknown section kind ${section.kind}`);
    assert(section.title && section.body && section.body.length >= 180, `${chapter.id}/${section.title}: section is too short`);
    curriculumWordCount += section.body.trim().split(/\s+/).length;
  }
  assert(Array.isArray(chapter.actors) && chapter.actors.length >= 2, `${chapter.id}: expected major actors`);
  actorCount += chapter.actors.length;
  for (const actor of chapter.actors) { assert(actor.name && actor.role && actor.role.length >= 60, `${chapter.id}: incomplete actor`); curriculumWordCount += actor.role.trim().split(/\s+/).length; }
  assert(Array.isArray(chapter.quiz) && chapter.quiz.length >= 4, `${chapter.id}: expected at least 4 quiz questions`);
  questionCount += chapter.quiz.length;
  chapter.quiz.forEach((question, qIndex) => {
    assert(question.prompt && question.prompt.length >= 35, `${chapter.id} Q${qIndex + 1}: prompt too short`);
    assert(Array.isArray(question.options) && question.options.length === 4, `${chapter.id} Q${qIndex + 1}: expected 4 options`);
    assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${chapter.id} Q${qIndex + 1}: invalid answer`);
    assert(question.explanation && question.explanation.length >= 90, `${chapter.id} Q${qIndex + 1}: explanation too short`);
    curriculumWordCount += [question.prompt, ...question.options, question.explanation].join(' ').trim().split(/\s+/).length;
  });
}
assert(sectionCount >= 40, `expected at least 40 sections, got ${sectionCount}`);
assert(actorCount >= 36, `expected at least 36 actor profiles, got ${actorCount}`);
assert(questionCount >= 48, `expected at least 48 questions, got ${questionCount}`);
assert(curriculumWordCount >= 7500, `expected at least 7,500 curriculum words, got ${curriculumWordCount}`);
assert(Array.isArray(timelineEvents) && timelineEvents.length >= 35, `expected at least 35 timeline events, got ${timelineEvents.length}`);
assert(timelineEvents.some(event => event.year === 1943 && /Ghetto Uprising/.test(event.title)), 'missing 1943 Warsaw Ghetto Uprising');
assert(timelineEvents.some(event => event.year === 1944 && /^Warsaw Uprising$/.test(event.title)), 'missing distinct 1944 Warsaw Uprising');
assert(timelineEvents.some(event => event.year >= 1989), 'timeline must cover democratic transition');
assert(Array.isArray(memoryPairs) && memoryPairs.length >= 12, 'expected at least 12 memory pairs');

const combined = JSON.stringify(chapters);
for (const topic of ['Mieszko', 'Jagiellonian', 'serfdom', 'Partitions', 'Holocaust', 'Solidarity', 'European Union', 'Ukraine']) {
  assert(combined.includes(topic), `curriculum missing required topic: ${topic}`);
}

console.log(`curriculum verification passed: ${chapters.length} chapters, ${sectionCount} sections, ${actorCount} actor profiles, ${questionCount} questions, ${timelineEvents.length} timeline events, ${curriculumWordCount} curriculum words`);
