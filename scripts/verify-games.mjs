import { readFileSync } from 'node:fs';
import { archiveCases, chronicleRounds, councilScenarios } from '../src/games.js';
import { applyCouncilChoice, evaluateArchiveCase, evaluateChronicle, moveCard } from '../src/game-engine.js';

const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(chronicleRounds.length >= 3, 'expected at least three chronicle rounds');
for (const round of chronicleRounds) {
  assert(round.chapterIds.length >= 2, `${round.id}: must connect multiple chapters`);
  assert(round.events.length >= 5, `${round.id}: expected at least five events`);
  assert(round.events.every(event => event.id && event.title && Number.isInteger(event.year) && event.clue), `${round.id}: incomplete event`);
  assert(round.events.every(event => !/\b\d{3,4}\b/.test(event.title)), `${round.id}: visible titles must not reveal years`);
}

assert(councilScenarios.length >= 5, 'expected a multi-turn council campaign');
for (const scenario of councilScenarios) {
  assert(scenario.chapterId && scenario.prompt && scenario.context, `${scenario.id}: incomplete scenario`);
  assert(scenario.options.length >= 3, `${scenario.id}: expected strategic alternatives`);
  assert(scenario.options.every(option => option.label && option.consequence && option.effects && Object.keys(option.effects).length >= 2), `${scenario.id}: incomplete option effects`);
  assert(scenario.options.every(option => Object.values(option.effects).some(value => value > 0) && Object.values(option.effects).some(value => value < 0)), `${scenario.id}: every policy must contain a real trade-off`);
}

assert(archiveCases.length >= 3, 'expected at least three archive casefiles');
for (const casefile of archiveCases) {
  assert(casefile.chapterIds.length >= 1 && casefile.evidence.length >= 5, `${casefile.id}: casefile lacks evidence`);
  assert(casefile.correctEvidence.length === 3, `${casefile.id}: select exactly three relevant sources`);
  assert(casefile.interpretations.length >= 3, `${casefile.id}: expected competing interpretations`);
  assert(casefile.interpretations.some(option => option.correct), `${casefile.id}: missing defensible interpretation`);
}

assert(JSON.stringify(moveCard(['a', 'b', 'c'], 2, 0)) === JSON.stringify(['c', 'a', 'b']), 'moveCard should reorder without mutation');
assert(evaluateChronicle(['a', 'b', 'c'], ['a', 'b', 'c']).perfect, 'chronicle perfect order not recognized');
assert(evaluateChronicle(['b', 'a', 'c'], ['a', 'b', 'c']).correctSlots === 1, 'chronicle partial scoring is wrong');
const council = applyCouncilChoice({ authority: 50, treasury: 95, cohesion: 4, liberty: 50 }, { effects: { authority: -10, treasury: 20, cohesion: -20 } });
assert(council.authority === 40 && council.treasury === 100 && council.cohesion === 0, 'council effects must clamp to 0–100');
let councilWins = 0; let councilLosses = 0;
const exploreCouncil = (turn, meters) => {
  if (turn === councilScenarios.length) {
    const values = Object.values(meters); const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    if (Math.min(...values) >= 20 && average >= 48) councilWins += 1; else councilLosses += 1;
    return;
  }
  councilScenarios[turn].options.forEach(option => exploreCouncil(turn + 1, applyCouncilChoice(meters, option)));
};
exploreCouncil(0, { authority: 50, treasury: 50, cohesion: 50, liberty: 50 });
assert(councilWins > 0 && councilLosses > councilWins, 'council campaign must be winnable but strategically challenging');
const archive = evaluateArchiveCase(['a', 'b', 'x'], ['a', 'b', 'c'], true);
assert(archive.evidenceScore === 2 && archive.passed === false, 'archive scoring must require evidence and interpretation');

const main = readFileSync('src/main.js', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
for (const marker of ['renderGameHub', 'renderChronicle', 'renderCouncil', 'renderArchive', 'data-game-tab', 'chronicleHint']) {
  assert(main.includes(marker), `main UI missing ${marker}`);
}
for (const removed of ['Timeline ordering', 'Partition puzzle', 'Memory match: ideas and meanings', 'checkOrder', 'checkPartition']) {
  assert(!main.includes(removed), `legacy game remains: ${removed}`);
}
for (const selector of ['.game-hub', '.game-tabs', '.chronicle-card', '.council-meter', '.archive-evidence', '.game-result']) {
  assert(css.includes(selector), `game CSS missing ${selector}`);
}

console.log(`game verification passed: ${chronicleRounds.length} chronicle rounds, ${councilScenarios.length} council turns, ${archiveCases.length} archive cases`);
