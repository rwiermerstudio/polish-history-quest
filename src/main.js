import './styles.css';
import { chapters, timelineEvents } from './curriculum.js';
import { archiveCases, chronicleRounds, councilScenarios } from './games.js';
import { applyCouncilChoice, createArchiveDisplay, evaluateArchiveCase, evaluateChronicle, moveCard } from './game-engine.js';
import { normalizeProgress } from './progress.js';

const STORAGE_KEY = 'polish-history-quest-progress-v1';
const legacyProgressMap = {
  origins: 'lands-before-poland', commonwealth: 'commonwealth', partitions: 'long-nineteenth-century',
  rebirth: 'second-republic', war: 'world-war-two', solidarity: 'protest-solidarity',
};
const defaultProgress = {
  completed: {}, score: 0, attempts: 0, streak: 0, achievements: {},
  answeredQuestions: {}, legacyCompleted: [], orderedWin: false, partitionWin: false, memoryWin: false,
  chronicleWins: {}, councilWin: false, archiveWins: {},
};

let progress = loadProgress();
let currentEra = 'all';
let currentChapterId = null;
let chapterSectionIndex = 0;
let chapterQuestionIndex = 0;
let transientAnswer = null;
let activeGame = 'chronicle';
let chronicleRoundIndex = 0;
let chronicleOrder = shuffle(chronicleRounds[0].events.map(event => event.id));
let chronicleHints = new Set();
let chronicleAttempts = 0;
let chronicleResult = null;
let councilTurn = 0;
let councilMeters = { authority: 50, treasury: 50, cohesion: 50, liberty: 50 };
let councilHistory = [];
let councilChoice = null;
let archiveCaseIndex = 0;
let selectedEvidence = new Set();
let archiveInterpretation = null;
let archiveResult = null;
const initialArchiveDisplay = createArchiveDisplay(archiveCases[0], 0);
let archiveEvidenceOrder = initialArchiveDisplay.evidence;
let archiveInterpretationOrder = initialArchiveDisplay.interpretations;

function loadProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return normalizeProgress(stored, chapters, legacyProgressMap, defaultProgress);
  } catch {
    return structuredClone(defaultProgress);
  }
}
function saveProgress() { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); renderProgress(); }
function shuffle(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}
function resetGameSession() {
  activeGame = 'chronicle';
  chronicleRoundIndex = 0;
  chronicleOrder = shuffle(chronicleRounds[0].events.map(event => event.id));
  chronicleHints = new Set(); chronicleAttempts = 0; chronicleResult = null;
  councilTurn = 0; councilMeters = { authority: 50, treasury: 50, cohesion: 50, liberty: 50 };
  councilHistory = []; councilChoice = null;
  archiveCaseIndex = 0; selectedEvidence = new Set(); archiveInterpretation = null; archiveResult = null;
  const archiveDisplay = createArchiveDisplay(archiveCases[0], 0);
  archiveEvidenceOrder = archiveDisplay.evidence; archiveInterpretationOrder = archiveDisplay.interpretations;
}
function pct() { return Math.round((Object.keys(progress.completed).length / chapters.length) * 100); }
function award(id) { progress.achievements[id] = true; }
function addScore(points) { progress.score += points; progress.streak += 1; if (progress.streak >= 3) award('streak'); saveProgress(); }
function miss() { progress.attempts += 1; progress.streak = 0; saveProgress(); }
function currentChapter() { return chapters.find(chapter => chapter.id === currentChapterId); }

function app() {
  document.querySelector('#app').innerHTML = `
    <div class="app">
      <header class="header"><nav class="nav"><div class="brand"><span class="eagle">♜</span><span>Polish History Quest</span></div><div class="navlinks"><a href="#eras">Curriculum</a><a href="#timeline">Timeline</a><a href="#games">Games</a><a href="#progress">Progress</a><button class="small-btn" id="exportBtn">Copy progress</button><button class="small-btn" id="resetBtn">Reset</button></div></nav></header>
      <section class="hero"><div><span class="badge">Expanded history curriculum</span><h1>Understand Poland through people, choices and changing borders.</h1><p class="lead">Thirteen substantial chapters place Polish history inside European and global history—from early state formation and the Commonwealth to occupation, Solidarity, democracy and today’s security debates.</p><div class="cta-row"><button class="btn btn-primary" data-scroll="eras">Begin the curriculum</button><button class="btn btn-secondary" data-scroll="games">Practise with games</button></div></div><div class="hero-card map-card">${mapSvg()}<div class="float-stat"><div class="stat"><b>${timelineEvents.length}</b><span>timeline events</span></div><div class="stat"><b>${chapters.length}</b><span>learning chapters</span></div><div class="stat"><b>${chapters.reduce((sum, chapter) => sum + chapter.quiz.length, 0)}</b><span>quiz questions</span></div></div></div></section>
      <section id="progress" class="section"><div class="section-title"><div><div class="kicker">Your journey</div><h2>Progress that stays in your browser</h2></div><strong id="score"></strong></div><div class="progress-shell"><div id="progressFill" class="progress-fill"></div></div><p class="lead" id="progressText"></p><div class="achievement-list" id="achievements"></div></section>
      <section id="eras" class="section alt"><div class="inner"><div class="section-title"><div><div class="kicker">Guided curriculum</div><h2>Thirteen chapters, c. 500 to the present</h2><p class="lead">Open a chapter, read its contextual sections, meet major actors, and complete four nuanced questions.</p></div></div><div class="grid eras" id="eraGrid"></div></div></section>
      <section id="timeline" class="section"><div class="section-title"><div><div class="kicker">Visual sequence</div><h2>Timeline of turning points</h2></div><select id="eraFilter" aria-label="Filter timeline by chapter"><option value="all">All chapters</option>${chapters.map(chapter => `<option value="${chapter.id}">${chapter.title}</option>`).join('')}</select></div><div class="timeline" id="timelineList"></div></section>
      <section id="games" class="section alt"><div class="inner"><div class="section-title"><div><div class="kicker">Playable history lab</div><h2>Decide, investigate and reconstruct</h2><p class="lead">Three replayable games test chronology without visible dates, strategic trade-offs, and evidence-based interpretation across the curriculum.</p></div></div><div class="game-hub"><div class="game-tabs" role="tablist" aria-label="History games"><button class="game-tab active" data-game-tab="chronicle" role="tab">⌛ Chronicle Forge</button><button class="game-tab" data-game-tab="council" role="tab">⚖ Commonwealth Council</button><button class="game-tab" data-game-tab="archive" role="tab">⌕ Archive Casefiles</button></div><div id="gameStage"></div></div></div></section>
      <footer class="footer">A broad historical survey, not an accredited school course. Static app; progress remains in this browser.</footer>
      <div class="chapter-modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-panel chapter-reader"><div class="modal-head"><div><span class="badge" id="modalYears"></span><h2 id="modalTitle"></h2><p class="chapter-summary" id="modalSummary"></p></div><button class="close" id="modalClose" aria-label="Close chapter">×</button></div><div id="chapterBody"></div></div></div>
    </div>`;
  bind();
  renderAll();
}

function bind() {
  document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.scroll).scrollIntoView({ behavior: 'smooth' })));
  document.getElementById('eraFilter').addEventListener('change', event => { currentEra = event.target.value; renderTimeline(); });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', event => { if (event.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Reset all locally stored learning progress?')) {
      progress = structuredClone(defaultProgress);
      localStorage.removeItem(STORAGE_KEY);
      resetGameSession();
      renderAll();
    }
  });
  document.getElementById('exportBtn').addEventListener('click', async () => {
    const summary = `Polish History Quest: ${pct()}% complete, ${Object.keys(progress.completed).length}/${chapters.length} chapters, score ${progress.score}.`;
    await navigator.clipboard?.writeText(summary);
    alert(summary);
  });
  document.querySelectorAll('[data-game-tab]').forEach(button => button.addEventListener('click', () => { activeGame = button.dataset.gameTab; renderGameHub(); }));
}

function renderAll() { renderProgress(); renderEras(); renderTimeline(); renderGameHub(); }

function renderProgress() {
  const percent = pct();
  const fill = document.getElementById('progressFill'); if (fill) fill.style.width = `${percent}%`;
  const score = document.getElementById('score'); if (score) score.textContent = `Score ${progress.score} · Streak ${progress.streak}`;
  const text = document.getElementById('progressText'); if (text) text.textContent = `${Object.keys(progress.completed).length} of ${chapters.length} chapters completed (${percent}%). A chapter completes after all of its questions are answered correctly.`;
  const achievements = [
    ['founder', 'Early Poland'], ['commonwealth', 'Commonwealth thinker'],
    ['war-memory', 'Memory with care'], ['solidarity', 'Solidarity scholar'], ['chronicle-forger', 'Chronicle forger'],
    ['council-strategist', 'Council strategist'], ['archive-detective', 'Archive detective'], ['streak', 'Learning streak'], ['legacy-learner', 'Original curriculum learner'], ['graduate', 'Curriculum complete'],
  ];
  const list = document.getElementById('achievements');
  if (list) list.innerHTML = achievements.map(([id, label]) => `<span class="achievement ${progress.achievements[id] ? 'unlocked' : ''}">${progress.achievements[id] ? '★' : '☆'} ${label}</span>`).join('');
}

function renderEras() {
  document.getElementById('eraGrid').innerHTML = chapters.map((chapter, index) => {
    const answered = Object.keys(progress.answeredQuestions[chapter.id] || {}).length;
    return `<article class="card era-card ${progress.completed[chapter.id] ? 'done' : ''}" data-era="${chapter.id}" tabindex="0" role="button" aria-label="Open chapter ${index + 1}: ${chapter.title}"><div class="era-meta"><span class="pill">Chapter ${index + 1}</span><span class="pill">${chapter.years}</span><span class="pill">${answered}/${chapter.quiz.length} questions</span></div><h3>${chapter.title}</h3><p>${chapter.summary}</p><strong class="chapter-open">Read chapter →</strong></article>`;
  }).join('');
  document.querySelectorAll('.era-card').forEach(card => {
    card.addEventListener('click', () => openChapter(card.dataset.era));
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openChapter(card.dataset.era); } });
  });
}

function renderTimeline() {
  const list = currentEra === 'all' ? timelineEvents : timelineEvents.filter(event => event.era === currentEra);
  document.getElementById('timelineList').innerHTML = list.map(event => `<div class="event"><span class="event-dot"></span><div class="card"><time>${event.year}</time><h3>${event.title}</h3><p>${event.text}</p></div></div>`).join('');
}

function openChapter(id) {
  currentChapterId = id;
  chapterSectionIndex = 0;
  chapterQuestionIndex = 0;
  const chapter = currentChapter();
  document.getElementById('modalYears').textContent = chapter.years;
  document.getElementById('modalTitle').textContent = chapter.title;
  document.getElementById('modalSummary').textContent = chapter.summary;
  renderChapterWorkspace();
  document.getElementById('modal').classList.add('open');
  document.getElementById('modalClose').focus();
}
function closeModal() { document.getElementById('modal').classList.remove('open'); }

function renderChapterWorkspace() {
  const chapter = currentChapter();
  document.getElementById('chapterBody').innerHTML = `
    <div class="chapter-layout">
      <main>${renderChapterSections(chapter)}</main>
      <aside class="chapter-sidebar"><div class="card"><div class="kicker">Central idea</div><p>${chapter.key}</p></div><div class="card"><div class="kicker">Important actors</div><div class="actor-grid">${chapter.actors.map(actor => `<article class="actor"><h4>${actor.name}</h4><p>${actor.role}</p></article>`).join('')}</div></div></aside>
    </div>
    ${renderChapterQuiz(chapter)}`;
  bindChapterControls();
}

function sectionLabel(kind) {
  return ({ context: 'Context', events: 'Events and causation', actors: 'Important actors', international: 'International context', society: 'Society and economy', culture: 'Culture and memory · Cultural artifact' })[kind] || kind;
}

function renderChapterSections(chapter) {
  const current = chapter.sections[chapterSectionIndex];
  return `<section class="chapter-section"><div class="section-tabs" aria-label="Chapter sections">${chapter.sections.map((item, index) => `<button class="section-tab ${index === chapterSectionIndex ? 'active' : ''}" data-section="${index}" aria-current="${index === chapterSectionIndex ? 'step' : 'false'}">${index + 1}. ${sectionLabel(item.kind)}</button>`).join('')}</div><div class="section-reading"><div class="kicker">${sectionLabel(current.kind)}</div><h3>${current.title}</h3><p>${current.body}</p></div><div class="section-nav"><button class="btn btn-secondary" id="sectionPrev" ${chapterSectionIndex === 0 ? 'disabled' : ''}>← Previous context</button><span>${chapterSectionIndex + 1} / ${chapter.sections.length}</span><button class="btn btn-primary" id="sectionNext" ${chapterSectionIndex === chapter.sections.length - 1 ? 'disabled' : ''}>Next context →</button></div></section>`;
}

function displayedQuestionOptions(item) {
  return item.options.map((text, originalIndex) => ({ text, originalIndex }));
}

function renderChapterQuiz(chapter) {
  const answers = progress.answeredQuestions[chapter.id] || {};
  const item = chapter.quiz[chapterQuestionIndex];
  const optionDisplay = displayedQuestionOptions(item);
  const selected = answers[chapterQuestionIndex] || (
    transientAnswer?.chapterId === chapter.id && transientAnswer.questionIndex === chapterQuestionIndex
      ? transientAnswer
      : null
  );
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(answer => answer.correct).length;
  const complete = correctCount === chapter.quiz.length;
  return `<section class="chapter-quiz card"><div class="quiz-head"><div><div class="kicker">Chapter quiz</div><h3>Reason with the history</h3></div><div class="quiz-progress"><strong>${correctCount}/${chapter.quiz.length} correct</strong><span>${answeredCount} attempted</span></div></div><div class="question-dots">${chapter.quiz.map((_, index) => `<button class="question-dot ${index === chapterQuestionIndex ? 'active' : ''} ${answers[index]?.correct ? 'correct' : answers[index] ? 'wrong' : ''}" data-question="${index}" aria-label="Question ${index + 1}">${index + 1}</button>`).join('')}</div><h4>${chapterQuestionIndex + 1}. ${item.prompt}</h4><div class="quiz-options">${optionDisplay.map(({ text, originalIndex }) => `<button class="option ${selected ? (originalIndex === item.answer ? 'correct' : selected.choice === originalIndex ? 'wrong' : '') : ''}" data-answer="${originalIndex}" ${selected ? 'disabled' : ''}>${text}</button>`).join('')}</div><div class="feedback" id="quizFeedback" aria-live="polite">${selected ? `<strong>${selected.correct ? 'Correct.' : 'Not quite.'}</strong> ${item.explanation}` : 'Choose the most defensible answer; several options may sound superficially plausible.'}</div><div class="section-nav"><button class="btn btn-secondary" id="questionPrev" ${chapterQuestionIndex === 0 ? 'disabled' : ''}>← Previous question</button><span>Question ${chapterQuestionIndex + 1} / ${chapter.quiz.length}</span><button class="btn btn-primary" id="questionNext" ${chapterQuestionIndex === chapter.quiz.length - 1 ? 'disabled' : ''}>Next question →</button></div>${complete ? '<div class="completion-banner">★ Chapter complete. You have answered every question correctly.</div>' : '<p class="quiz-note">A chapter completes only after all four questions are correct. Incorrect questions can be retried.</p>'}</section>`;
}

function bindChapterControls() {
  document.querySelectorAll('.section-tab').forEach(button => button.addEventListener('click', () => { chapterSectionIndex = Number(button.dataset.section); renderChapterWorkspace(); }));
  document.getElementById('sectionPrev')?.addEventListener('click', () => { chapterSectionIndex -= 1; renderChapterWorkspace(); });
  document.getElementById('sectionNext')?.addEventListener('click', () => { chapterSectionIndex += 1; renderChapterWorkspace(); });
  document.querySelectorAll('.question-dot').forEach(button => button.addEventListener('click', () => { chapterQuestionIndex = Number(button.dataset.question); renderChapterWorkspace(); }));
  document.getElementById('questionPrev')?.addEventListener('click', () => { chapterQuestionIndex -= 1; renderChapterWorkspace(); });
  document.getElementById('questionNext')?.addEventListener('click', () => { chapterQuestionIndex += 1; renderChapterWorkspace(); });
  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => answerChapterQuestion(Number(button.dataset.answer))));
}

function answerChapterQuestion(choice) {
  const chapter = currentChapter();
  const questionIndex = chapterQuestionIndex;
  const item = chapter.quiz[questionIndex];
  const correct = choice === item.answer;
  progress.answeredQuestions[chapter.id] ||= {};
  if (correct) {
    transientAnswer = null;
    progress.answeredQuestions[chapter.id][questionIndex] = { choice, correct: true };
    addScore(40);
  } else {
    transientAnswer = { chapterId: chapter.id, questionIndex, choice, correct: false };
    miss();
    // Keep the explanation visible briefly without persisting a reload-blocking wrong answer.
    setTimeout(() => {
      if (transientAnswer?.chapterId === chapter.id && transientAnswer.questionIndex === questionIndex) {
        transientAnswer = null;
        if (currentChapterId === chapter.id && chapterQuestionIndex === questionIndex) renderChapterWorkspace();
      }
    }, 2500);
  }
  const answers = progress.answeredQuestions[chapter.id];
  if (chapter.quiz.every((_, index) => answers[index]?.correct) && !progress.completed[chapter.id]) {
    progress.completed[chapter.id] = true;
    awardForChapter(chapter.id);
    if (Object.keys(progress.completed).length === chapters.length) award('graduate');
    addScore(200);
  }
  saveProgress();
  renderEras();
  renderChapterWorkspace();
}

function awardForChapter(id) {
  if (['lands-before-poland', 'fragmentation-reunification'].includes(id)) award('founder');
  if (['jagiellonian-union', 'commonwealth', 'crisis-reform'].includes(id)) award('commonwealth');
  if (id === 'world-war-two') award('war-memory');
  if (id === 'protest-solidarity') award('solidarity');
}

function chapterTitle(id) { return chapters.find(chapter => chapter.id === id)?.title || id; }
function effectLabel(value) { return value > 0 ? `▲ ${value}` : value < 0 ? `▼ ${Math.abs(value)}` : '—'; }

function renderGameHub() {
  document.querySelectorAll('[data-game-tab]').forEach(button => {
    const active = button.dataset.gameTab === activeGame;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  if (activeGame === 'chronicle') renderChronicle();
  if (activeGame === 'council') renderCouncil();
  if (activeGame === 'archive') renderArchive();
}

function renderChronicle() {
  const round = chronicleRounds[chronicleRoundIndex];
  const byId = new Map(round.events.map(event => [event.id, event]));
  const won = Boolean(progress.chronicleWins[round.id]);
  document.getElementById('gameStage').innerHTML = `
    <article class="game-board chronicle-board">
      <div class="game-masthead"><div><span class="game-eyebrow">Game 1 · Round ${chronicleRoundIndex + 1}/${chronicleRounds.length}</span><h3>Chronicle Forge</h3><p>${round.briefing}</p></div><div class="game-score"><strong>${won ? 'Mastered' : `${Math.max(0, 300 - chronicleHints.size * 30 - chronicleAttempts * 25)} pts`}</strong><span>${chronicleHints.size} clues used</span></div></div>
      <div class="game-chapter-links">${round.chapterIds.map(id => `<button data-open-game-chapter="${id}">${chapterTitle(id)}</button>`).join('')}</div>
      <div class="chronicle-rail" aria-label="Arrange events from earliest to latest">${chronicleOrder.map((id, index) => {
        const event = byId.get(id); const hint = chronicleHints.has(id);
        return `<article class="chronicle-card ${chronicleResult?.perfect ? 'solved' : ''}"><div class="chronicle-position">${index + 1}</div><div><span class="game-eyebrow">${hint ? event.clue : 'Date sealed · reason from context'}</span><h4>${event.title}</h4>${chronicleResult?.perfect ? `<time>${event.year}</time>` : ''}</div><div class="chronicle-controls"><button data-chronicle-move="up" data-index="${index}" aria-label="Move ${event.title} earlier">↑</button><button data-chronicle-move="down" data-index="${index}" aria-label="Move ${event.title} later">↓</button><button data-chronicle-hint="${id}" ${hint ? 'disabled' : ''} aria-label="Reveal a clue for ${event.title}">?</button></div></article>`;
      }).join('')}</div>
      <div class="game-actions"><button class="btn btn-secondary" id="chronicleShuffle">Reshuffle</button><button class="btn btn-primary" id="chronicleCheck">Seal the chronicle</button>${chronicleResult?.perfect ? `<button class="btn btn-secondary" id="chronicleNext">${chronicleRoundIndex === chronicleRounds.length - 1 ? 'Replay first round' : 'Next chronicle'} →</button>` : ''}</div>
      <div class="game-result ${chronicleResult?.perfect ? 'success' : ''}" id="chronicleFeedback" aria-live="polite">${chronicleResult ? (chronicleResult.perfect ? `<strong>Chronicle restored.</strong> Every date is now revealed. You earned ${chronicleResult.points} points.` : `<strong>Not sealed yet.</strong> ${chronicleResult.correctSlots}/5 events occupy the right slot and ${chronicleResult.adjacentPairs}/4 neighbouring pairs are correct.`) : '<strong>No years are shown.</strong> Use causation, institutions and relative sequence. Clues cost points.'}</div>
    </article>`;
  document.querySelectorAll('[data-chronicle-move]').forEach(button => button.addEventListener('click', () => {
    const from = Number(button.dataset.index); const to = from + (button.dataset.chronicleMove === 'up' ? -1 : 1);
    chronicleOrder = moveCard(chronicleOrder, from, to); chronicleResult = null; renderChronicle();
  }));
  document.querySelectorAll('[data-chronicle-hint]').forEach(button => button.addEventListener('click', () => { chronicleHints.add(button.dataset.chronicleHint); renderChronicle(); }));
  document.getElementById('chronicleShuffle').addEventListener('click', () => { chronicleOrder = shuffle(chronicleOrder); chronicleResult = null; renderChronicle(); });
  document.getElementById('chronicleCheck').addEventListener('click', checkChronicle);
  document.getElementById('chronicleNext')?.addEventListener('click', nextChronicle);
  bindGameChapterLinks();
}

function checkChronicle() {
  const round = chronicleRounds[chronicleRoundIndex];
  const correctOrder = [...round.events].sort((a, b) => a.year - b.year).map(event => event.id);
  const result = evaluateChronicle(chronicleOrder, correctOrder);
  chronicleAttempts += 1;
  const points = Math.max(100, 300 - chronicleHints.size * 30 - (chronicleAttempts - 1) * 25);
  chronicleResult = { ...result, points };
  if (result.perfect && !progress.chronicleWins[round.id]) {
    progress.chronicleWins[round.id] = true;
    if (Object.keys(progress.chronicleWins).length === chronicleRounds.length) award('chronicle-forger');
    addScore(points);
  } else if (!result.perfect) miss();
  renderChronicle();
}

function nextChronicle() {
  chronicleRoundIndex = (chronicleRoundIndex + 1) % chronicleRounds.length;
  chronicleOrder = shuffle(chronicleRounds[chronicleRoundIndex].events.map(event => event.id));
  chronicleHints = new Set(); chronicleAttempts = 0; chronicleResult = null; renderChronicle();
}

function renderCouncil() {
  const complete = councilTurn >= councilScenarios.length;
  const minimum = Math.min(...Object.values(councilMeters));
  const average = Math.round(Object.values(councilMeters).reduce((sum, value) => sum + value, 0) / 4);
  const survived = complete && minimum >= 20 && average >= 48;
  const scenario = councilScenarios[Math.min(councilTurn, councilScenarios.length - 1)];
  document.getElementById('gameStage').innerHTML = `
    <article class="game-board council-board">
      <div class="game-masthead"><div><span class="game-eyebrow">Game 2 · Five-turn strategy campaign</span><h3>Commonwealth Council</h3><p>Balance state capacity, revenue, political cohesion and constitutional liberty. Every policy solves one problem while risking another.</p></div><div class="game-score"><strong>Turn ${Math.min(councilTurn + 1, councilScenarios.length)}/${councilScenarios.length}</strong><span>${councilHistory.length} decisions recorded</span></div></div>
      <div class="council-dashboard">${Object.entries(councilMeters).map(([meter, value]) => `<div class="council-meter"><div><span>${meter}</span><strong>${value}</strong></div><div class="meter-track"><span style="width:${value}%"></span></div></div>`).join('')}</div>
      ${complete ? `<div class="council-finale ${survived ? 'success' : 'failure'}"><span class="game-eyebrow">Campaign complete</span><h4>${survived ? 'A difficult constitutional balance survives' : 'The settlement fractures under accumulated pressure'}</h4><p>${survived ? 'You preserved every meter above crisis level while keeping the whole system viable. This is a counterfactual strategy exercise, not a claim that one policy could have prevented the partitions.' : 'One or more foundations fell below a sustainable level. Review the decision ledger and try a different coalition of policies.'}</p><button class="btn btn-primary" id="councilRestart">Replay campaign</button></div>` : `
        <div class="council-scenario"><div class="scenario-stamp"><span>${scenario.era}</span><b>${councilTurn + 1}</b></div><div><span class="game-eyebrow">Linked chapter</span><button class="chapter-link" data-open-game-chapter="${scenario.chapterId}">${chapterTitle(scenario.chapterId)} ↗</button><h4>${scenario.title}</h4><p>${scenario.context}</p><strong>${scenario.prompt}</strong></div></div>
        <div class="council-options">${scenario.options.map((option, index) => `<button class="council-option ${councilChoice === index ? 'selected' : ''}" data-council-choice="${index}" ${councilChoice !== null ? 'disabled' : ''}><span class="option-number">0${index + 1}</span><strong>${option.label}</strong><span class="effect-preview">${councilChoice === index ? Object.entries(option.effects).map(([meter, value]) => `<i class="${value < 0 ? 'risk' : 'gain'}">${meter} ${effectLabel(value)}</i>`).join('') : '<i>Effects sealed until commitment</i>'}</span></button>`).join('')}</div>
        ${councilChoice !== null ? `<div class="game-result"><strong>Dispatch from the chamber</strong><p>${scenario.options[councilChoice].consequence}</p><button class="btn btn-primary" id="councilNext">Continue to the next crisis →</button></div>` : '<div class="game-result">Choose a policy from the historical context. Meter effects and consequences are revealed only after commitment.</div>'}`}
      ${councilHistory.length ? `<details class="decision-ledger"><summary>Decision ledger · ${councilHistory.length} entries</summary>${councilHistory.map(item => `<div><b>${item.title}</b><span>${item.choice}</span></div>`).join('')}</details>` : ''}
    </article>`;
  document.querySelectorAll('[data-council-choice]').forEach(button => button.addEventListener('click', () => chooseCouncil(Number(button.dataset.councilChoice))));
  document.getElementById('councilNext')?.addEventListener('click', () => { councilTurn += 1; councilChoice = null; if (councilTurn === councilScenarios.length) finishCouncil(); renderCouncil(); });
  document.getElementById('councilRestart')?.addEventListener('click', resetCouncil);
  bindGameChapterLinks();
}

function chooseCouncil(index) {
  const scenario = councilScenarios[councilTurn]; const option = scenario.options[index];
  councilChoice = index; councilMeters = applyCouncilChoice(councilMeters, option);
  councilHistory.push({ title: scenario.title, choice: option.label }); renderCouncil();
}

function finishCouncil() {
  const minimum = Math.min(...Object.values(councilMeters));
  const average = Object.values(councilMeters).reduce((sum, value) => sum + value, 0) / 4;
  if (minimum >= 20 && average >= 48 && !progress.councilWin) { progress.councilWin = true; award('council-strategist'); addScore(Math.round(average * 5)); }
  else if (minimum < 20 || average < 48) miss();
}

function resetCouncil() {
  councilTurn = 0; councilMeters = { authority: 50, treasury: 50, cohesion: 50, liberty: 50 };
  councilHistory = []; councilChoice = null; renderCouncil();
}

function renderArchive() {
  const casefile = archiveCases[archiveCaseIndex];
  const won = Boolean(progress.archiveWins[casefile.id]);
  document.getElementById('gameStage').innerHTML = `
    <article class="game-board archive-board">
      <div class="game-masthead"><div><span class="game-eyebrow">Game 3 · Dossier ${archiveCaseIndex + 1}/${archiveCases.length}</span><h3>Archive Casefiles</h3><p>${casefile.brief}</p></div><div class="game-score"><strong>${won ? 'Solved' : `${selectedEvidence.size}/3 sources`}</strong><span>Evidence before verdict</span></div></div>
      <div class="casefile-head"><div class="casefile-folder"><span>ARCHIWUM</span><b>${String(archiveCaseIndex + 1).padStart(2, '0')}</b></div><div><h4>${casefile.title}</h4><div class="game-chapter-links">${casefile.chapterIds.map(id => `<button data-open-game-chapter="${id}">${chapterTitle(id)}</button>`).join('')}</div></div></div>
      <div class="archive-workspace"><section><span class="game-eyebrow">Evidence table · select exactly three</span><div class="archive-evidence">${archiveEvidenceOrder.map(id => { const item = casefile.evidence.find(source => source.id === id); const relevant = casefile.correctEvidence.includes(item.id); return `<button class="evidence-card ${selectedEvidence.has(item.id) ? 'selected' : ''} ${archiveResult ? (relevant ? 'relevant' : selectedEvidence.has(item.id) ? 'false-lead' : '') : ''}" data-evidence="${item.id}" ${archiveResult ? 'disabled' : ''}><span>${item.source}</span><strong>${item.label}</strong><p>${item.text}</p>${archiveResult ? `<em class="evidence-status">${relevant ? 'Relevant source' : selectedEvidence.has(item.id) ? 'False lead' : 'Not selected'}</em>` : ''}</button>`; }).join('')}</div></section><aside class="interpretation-panel"><span class="game-eyebrow">Competing interpretations</span>${archiveInterpretationOrder.map((sourceIndex, displayIndex) => { const option = casefile.interpretations[sourceIndex]; return `<button class="interpretation ${archiveInterpretation === sourceIndex ? 'selected' : ''} ${archiveResult ? (option.correct ? 'relevant' : archiveInterpretation === sourceIndex ? 'false-lead' : '') : ''}" data-interpretation="${sourceIndex}" ${archiveResult ? 'disabled' : ''}><b>${String.fromCharCode(65 + displayIndex)}</b><span>${option.text}${archiveResult ? `<em class="interpretation-status">${option.correct ? 'Defensible interpretation' : archiveInterpretation === sourceIndex ? 'Selected interpretation not supported' : 'Alternative not supported'}</em>` : ''}</span></button>`; }).join('')}<button class="btn btn-primary" id="archiveSubmit" ${selectedEvidence.size !== 3 || archiveInterpretation === null || archiveResult ? 'disabled' : ''}>Submit evidence brief</button></aside></div>
      <div class="game-result ${archiveResult?.passed ? 'success' : ''}" aria-live="polite">${archiveResult ? (archiveResult.passed ? '<strong>Case solved.</strong> Your evidence is relevant and your interpretation preserves causal and ethical precision.' : `<strong>Brief returned for revision.</strong> ${archiveResult.evidenceScore}/3 sources were relevant; ${archiveResult.falseLeads} false lead${archiveResult.falseLeads === 1 ? '' : 's'} entered the brief. <strong>Interpretation:</strong> ${archiveResult.interpretationCorrect ? 'your selected explanation is defensible, but the evidence set needs revision.' : 'your selected explanation is not adequately supported; choose the interpretation that accounts for the evidence without overgeneralizing.'}`) : '<strong>Archivist’s rule:</strong> relevance is not the same as interest. Build the evidence set that directly tests the question.'}${archiveResult ? `<div class="game-actions"><button class="btn btn-secondary" id="archiveRetry">Reopen file</button>${archiveResult.passed ? `<button class="btn btn-primary" id="archiveNext">${archiveCaseIndex === archiveCases.length - 1 ? 'Return to first dossier' : 'Next dossier'} →</button>` : ''}</div>` : ''}</div>
    </article>`;
  document.querySelectorAll('[data-evidence]').forEach(button => button.addEventListener('click', () => toggleEvidence(button.dataset.evidence)));
  document.querySelectorAll('[data-interpretation]').forEach(button => button.addEventListener('click', () => { archiveInterpretation = Number(button.dataset.interpretation); renderArchive(); }));
  document.getElementById('archiveSubmit')?.addEventListener('click', submitArchive);
  document.getElementById('archiveRetry')?.addEventListener('click', resetArchiveCase);
  document.getElementById('archiveNext')?.addEventListener('click', nextArchiveCase);
  bindGameChapterLinks();
}

function toggleEvidence(id) {
  if (selectedEvidence.has(id)) selectedEvidence.delete(id);
  else if (selectedEvidence.size < 3) selectedEvidence.add(id);
  renderArchive();
}

function submitArchive() {
  const casefile = archiveCases[archiveCaseIndex];
  archiveResult = evaluateArchiveCase([...selectedEvidence], casefile.correctEvidence, casefile.interpretations[archiveInterpretation].correct);
  if (archiveResult.passed && !progress.archiveWins[casefile.id]) {
    progress.archiveWins[casefile.id] = true;
    if (Object.keys(progress.archiveWins).length === archiveCases.length) award('archive-detective');
    addScore(250);
  } else if (!archiveResult.passed) miss();
  renderArchive();
}

function resetArchiveCase() { selectedEvidence = new Set(); archiveInterpretation = null; archiveResult = null; renderArchive(); }
function prepareArchiveCase() {
  const casefile = archiveCases[archiveCaseIndex];
  selectedEvidence = new Set(); archiveInterpretation = null; archiveResult = null;
  const archiveDisplay = createArchiveDisplay(casefile, archiveCaseIndex);
  archiveEvidenceOrder = archiveDisplay.evidence; archiveInterpretationOrder = archiveDisplay.interpretations;
  renderArchive();
}
function nextArchiveCase() { archiveCaseIndex = (archiveCaseIndex + 1) % archiveCases.length; prepareArchiveCase(); }
function bindGameChapterLinks() { document.querySelectorAll('[data-open-game-chapter]').forEach(button => button.addEventListener('click', () => openChapter(button.dataset.openGameChapter))); }

function mapSvg() {
  return `<svg class="map-svg" viewBox="0 0 720 360" role="img" aria-label="Abstract map-like visualization of Poland's changing borders"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#c1121f"/><stop offset="1" stop-color="#d6a545"/></linearGradient></defs><rect width="720" height="360" rx="24" fill="#f7f1e8"/><path d="M175 105 C230 35 326 58 363 92 C411 136 491 103 540 160 C590 218 548 297 462 304 C383 310 353 270 281 287 C206 304 138 259 132 195 C128 158 151 135 175 105Z" fill="white" stroke="#14213d" stroke-width="5"/><path d="M210 145 C270 105 318 124 360 155 C399 184 457 174 498 213" fill="none" stroke="url(#g)" stroke-width="16" stroke-linecap="round" opacity=".9"/><circle cx="300" cy="160" r="14" fill="#c1121f"/><circle cx="425" cy="210" r="14" fill="#d6a545"/><text x="42" y="58" font-size="22" font-weight="800" fill="#14213d">Borders shift. People adapt.</text><text x="42" y="88" font-size="14" fill="#6f675d">A map-inspired learning surface, not a territorial claim.</text></svg>`;
}

app();
