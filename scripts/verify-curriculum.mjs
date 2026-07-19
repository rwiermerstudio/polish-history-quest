import { chapters, timelineEvents, memoryPairs } from '../src/curriculum.js';
import { existsSync } from 'node:fs';

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
let mediaCount = 0;
let publicDomainMediaCount = 0;
const mediaTypes = new Set();
const answerPositions = [0, 0, 0, 0];
const requiredSectionKinds = new Set(['context', 'events', 'actors', 'international', 'society', 'culture', 'interpretation']);
for (const chapter of chapters) {
  assert(chapter.id && !chapterIds.has(chapter.id), `duplicate or missing chapter id: ${chapter.id}`);
  chapterIds.add(chapter.id);
  assert(chapter.title && chapter.years && chapter.summary, `${chapter.id}: missing title, years or summary`);
  if (chapter.companion) {
    const chapterNumber = chapters.indexOf(chapter) + 1;
    const expectedHref = `./chapter-${chapterNumber}-companion.html`;
    assert(chapter.companion.title && chapter.companion.description?.length >= 80, `${chapter.id}: incomplete companion metadata`);
    assert(chapter.companion.href === expectedHref, `${chapter.id}: companion must use portable path ${expectedHref}`);
    assert(existsSync(`public/${expectedHref.slice(2)}`), `${chapter.id}: companion file is missing`);
  }
  curriculumWordCount += [chapter.summary, chapter.key].join(' ').trim().split(/\s+/).length;
  assert(Number.isFinite(chapter.startYear) && Number.isFinite(chapter.endYear), `${chapter.id}: invalid year bounds`);
  assert(chapter.startYear <= chapter.endYear, `${chapter.id}: inverted year bounds`);
  assert(Array.isArray(chapter.sections) && chapter.sections.length >= 5, `${chapter.id}: expected at least 5 explanatory sections`);
  sectionCount += chapter.sections.length;
  const kinds = new Set(chapter.sections.map(section => section.kind));
  assert(kinds.has('context'), `${chapter.id}: missing context section`);
  assert(kinds.has('international'), `${chapter.id}: missing international context`);
  assert(kinds.has('culture'), `${chapter.id}: missing culture/artifact section`);
  assert(kinds.has('interpretation'), `${chapter.id}: missing making-sense interpretation section`);
  const chapterReadingWordCount = chapter.sections.flatMap(section => section.body.trim().split(/\s+/)).length;
  assert(chapterReadingWordCount >= 500, `${chapter.id}: expected at least 500 chapter-reading words, got ${chapterReadingWordCount}`);
  const interpretationSection = chapter.sections.find(section => section.kind === 'interpretation');
  assert(interpretationSection.body.trim().split(/\s+/).length >= 220, `${chapter.id}: interpretation synthesis is too short`);
  for (const section of chapter.sections) {
    assert(requiredSectionKinds.has(section.kind), `${chapter.id}: unknown section kind ${section.kind}`);
    assert(section.title && section.body && section.body.length >= 180, `${chapter.id}/${section.title}: section is too short`);
    curriculumWordCount += section.body.trim().split(/\s+/).length;
  }
  assert(Array.isArray(chapter.actors) && chapter.actors.length >= 2, `${chapter.id}: expected major actors`);
  actorCount += chapter.actors.length;
  for (const actor of chapter.actors) { assert(actor.name && actor.role && actor.role.length >= 60, `${chapter.id}: incomplete actor`); curriculumWordCount += actor.role.trim().split(/\s+/).length; }
  assert(Array.isArray(chapter.media) && chapter.media.length >= 2, `${chapter.id}: expected at least two contextual media items`);
  for (const item of chapter.media) {
    assert(item.id && item.type && item.title && item.src && item.source && item.license && item.caption && item.alt, `${chapter.id}: incomplete media metadata`);
    assert(item.caption.length >= 100, `${chapter.id}/${item.id}: media caption must explain historical significance`);
    assert(item.alt.length >= 40, `${chapter.id}/${item.id}: media alternative text is too short`);
    assert(['image', 'map', 'audio', 'video'].includes(item.type), `${chapter.id}/${item.id}: unsupported media type ${item.type}`);
    assert(/^https:\/\//.test(item.src) && /^https:\/\//.test(item.source), `${chapter.id}/${item.id}: media URLs must use HTTPS`);
    assert(/^https:\/\/commons\.wikimedia\.org\//.test(item.source), `${chapter.id}/${item.id}: expected a stable Wikimedia Commons provenance page`);
    assert(/Public domain|CC0|CC BY(?:-SA)?/i.test(item.license), `${chapter.id}/${item.id}: media must be public domain or openly licensed`);
    if (/CC BY/i.test(item.license)) assert(item.attribution && !/source record/i.test(item.attribution), `${chapter.id}/${item.id}: attribution licence requires named creator/source`);
    if (item.type === 'audio' || item.type === 'video') {
      assert(item.mediaLabel && item.textAlternative?.length >= 200, `${chapter.id}/${item.id}: audiovisual media requires a specific label and substantial text alternative`);
    }
    mediaCount += 1;
    mediaTypes.add(item.type);
    if (/Public domain|CC0/i.test(item.license)) publicDomainMediaCount += 1;
  }
  assert(Array.isArray(chapter.quiz) && chapter.quiz.length >= 4, `${chapter.id}: expected at least 4 quiz questions`);
  questionCount += chapter.quiz.length;
  const chapterPositions = [0, 0, 0, 0];
  chapter.quiz.forEach((question, qIndex) => {
    assert(question.prompt && question.prompt.length >= 35, `${chapter.id} Q${qIndex + 1}: prompt too short`);
    assert(Array.isArray(question.options) && question.options.length === 4, `${chapter.id} Q${qIndex + 1}: expected 4 options`);
    assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${chapter.id} Q${qIndex + 1}: invalid answer`);
    answerPositions[question.answer] += 1;
    chapterPositions[question.answer] += 1;
    assert(new Set(question.options).size === 4, `${chapter.id} Q${qIndex + 1}: duplicate options`);
    assert(question.explanation && question.explanation.length >= 90, `${chapter.id} Q${qIndex + 1}: explanation too short`);
    assert(question.coverage?.section && question.coverage?.evidence, `${chapter.id} Q${qIndex + 1}: missing quiz-to-text coverage reference`);
    const coverageSection = chapter.sections.find(section => section.title === question.coverage.section);
    assert(coverageSection, `${chapter.id} Q${qIndex + 1}: coverage section not found: ${question.coverage.section}`);
    assert(coverageSection.body.toLocaleLowerCase('en').includes(question.coverage.evidence.toLocaleLowerCase('en')), `${chapter.id} Q${qIndex + 1}: coverage evidence is not present in the named section`);
    curriculumWordCount += [question.prompt, ...question.options, question.explanation].join(' ').trim().split(/\s+/).length;
  });
  assert(chapterPositions.every(count => count === 1), `${chapter.id}: answer positions must be locally balanced, got ${chapterPositions.join(', ')}`);
}
assert(sectionCount >= 40, `expected at least 40 sections, got ${sectionCount}`);
assert(actorCount >= 36, `expected at least 36 actor profiles, got ${actorCount}`);
assert(questionCount >= 48, `expected at least 48 questions, got ${questionCount}`);
assert(curriculumWordCount >= 12500, `expected at least 12,500 curriculum words, got ${curriculumWordCount}`);
assert(mediaCount >= 26, `expected at least 26 contextual media items, got ${mediaCount}`);
assert(publicDomainMediaCount >= 18, `expected at least 18 public-domain/CC0 media items, got ${publicDomainMediaCount}`);
for (const type of ['image', 'map', 'audio', 'video']) assert(mediaTypes.has(type), `curriculum missing media type: ${type}`);
assert(answerPositions.every(count => count >= 8), `correct answer positions are too skewed: ${answerPositions.join(', ')}`);
assert(Array.isArray(timelineEvents) && timelineEvents.length >= 35, `expected at least 35 timeline events, got ${timelineEvents.length}`);
assert(timelineEvents.some(event => event.year === 1943 && /Ghetto Uprising/.test(event.title)), 'missing 1943 Warsaw Ghetto Uprising');
assert(timelineEvents.some(event => event.year === 1944 && /^Warsaw Uprising$/.test(event.title)), 'missing distinct 1944 Warsaw Uprising');
assert(timelineEvents.some(event => event.year >= 1989), 'timeline must cover democratic transition');
assert(Array.isArray(memoryPairs) && memoryPairs.length >= 12, 'expected at least 12 memory pairs');

const combined = JSON.stringify(chapters);
const combinedQuizOptions = chapters.flatMap(chapter => chapter.quiz.flatMap(question => question.options)).join('\n');
for (const topic of ['Mieszko', 'Jagiellonian', 'serfdom', 'Partitions', 'Holocaust', 'Solidarity', 'European Union', 'Ukraine', 'Żeligowski', 'Volhynia', 'Eastern Galicia', 'Jedwabne', 'Kielce', 'Operation Vistula', 'Belarusian schooling', '1.8–1.9 million', 'soldiers, police officers and civilians']) {
  assert(combined.includes(topic), `curriculum missing required topic: ${topic}`);
}

for (const phrase of [
  'converted to Buddhism', 'Ottoman grand vizier', 'colonize South America', 'joined the European Union',
  'built by Napoleon as a naval base', 'twentieth-century communist forgeries', 'single province of France',
  'personally invented Gothic architecture', 'all inhabitants moved to France', 'Cossacks were a Swedish royal dynasty',
  'The Soviet Union operated every German camp', 'roughly three million non-Jewish Polish citizens',
  'modern federal democracy', 'All government and trade disappeared', 'ended monarchy and serfdom everywhere',
  'every inhabitant to speak German', 'Mongol administration', 'Polish peasant union', 'ruled Hungary from Kraków',
  'conquered all of Europe', 'colonial project organized by France', 'only to promote heliocentrism',
  'replaced the king with a communist party', 'every town an independent republic', 'universal adult suffrage', 'Ottoman sultan control',
  'compulsory atheism', 'treaty ending the First World War', 'medieval kings should be elected retroactively',
  'factories should replace every farm immediately', 'No Polish political movements existed',
  'Poland had declared war on itself', 'all mercenaries', 'There were no Polish speakers', 'All minorities left in 1918',
  'solved by one person after 1945', 'Both occurred after Germany surrendered', 'No one moved between 1945 and 1950',
  'It abolished all work', 'It restored noble privileges', 'All censorship ended permanently',
  'capital of the medieval Commonwealth', 'It remained uninhabited', 'directed only at foreign tourists',
  'operated as a foreign army', 'proof that no repression occurred', 'policy announced by NATO',
  'It abolished Polish elections', 'History never matters to policy', 'Every conflict is identical to 1939',
  'contain no useful information', 'Teutonic Order conquered Moscow', 'abolished private landownership',
  'made farming irrelevant', 'had no eastern frontier', 'no connection to Ukraine or Muscovy',
  'Kościuszko supported Prussian annexation', 'No European power possessed a standing army',
  'medieval crusading order', 'Russian colony created in 1815', 'That French law would exist',
  'That armies would recruit soldiers', 'That nobles could own estates', 'celebrates permanent partition rule',
  'restored serfdom everywhere', 'existed only outside Europe', 'social change stopped after 1815',
  'Every village was ethnically identical', 'Every law was already identical', 'refused to create a currency',
  'Britain received no foreign help', 'unrelated to mathematics', 'two names for the same event',
  'assuming every person acted identically', 'It ended censorship', 'rejected workplace issues entirely',
  'represented only senior party officials', 'Solidarity had ceased to exist entirely', 'Nothing important changed',
  'Soviet Union annexed western Poland', 'ended every economic inequality', 'Only medieval examples are legitimate',
  'constitution ordered the country to disappear', 'Language and religion immediately disappeared',
  'Citizenship was limited to military officers', 'post-war films as the only evidence',
  'exile government requested communist rule', 'benefited every citizen equally from the first day',
]) {
  assert(!combinedQuizOptions.includes(phrase), `exported quiz still contains implausible distractor: ${phrase}`);
}
for (const falseMediaDescription of ['civilians under armed German guard', 'strike activity inside', 'A staged border-post photograph', 'Listen · primary-source sound']) {
  assert(!combined.includes(falseMediaDescription), `curriculum still contains disproven or misleading media description: ${falseMediaDescription}`);
}
for (const requiredNaraFact of ['Mauthausen in Austria', 'Hadamar, a Nazi “euthanasia” killing facility in Germany', 'does not show the German killing centres in occupied Poland']) {
  assert(combined.includes(requiredNaraFact), `NARA film context missing required distinction: ${requiredNaraFact}`);
}
const naraFilm = chapters.flatMap(chapter => chapter.media).find(item => item.id === 'nara-film');
assert(naraFilm, 'NARA evidence film is missing');
for (const field of ['caption', 'alt', 'textAlternative']) {
  for (const requiredFact of ['Mauthausen', 'Austria', 'Hadamar', 'euthanasia', 'occupied Poland']) {
    assert(naraFilm[field]?.includes(requiredFact), `NARA ${field} missing required accessibility fact: ${requiredFact}`);
  }
}

console.log(`curriculum verification passed: ${chapters.length} chapters, ${sectionCount} sections, ${actorCount} actor profiles, ${questionCount} questions, ${timelineEvents.length} timeline events, ${curriculumWordCount} curriculum words`);
