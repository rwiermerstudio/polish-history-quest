import './styles.css';
import { chapters, timelineEvents, memoryPairs } from './curriculum.js';

const STORAGE_KEY = 'polish-history-quest-progress-v1';
const legacyProgressMap = {
  origins: 'lands-before-poland', commonwealth: 'commonwealth', partitions: 'long-nineteenth-century',
  rebirth: 'second-republic', war: 'world-war-two', solidarity: 'protest-solidarity',
};
const defaultProgress = {
  completed: {}, score: 0, attempts: 0, streak: 0, achievements: {},
  answeredQuestions: {}, legacyCompleted: [], orderedWin: false, partitionWin: false, memoryWin: false,
};

let progress = loadProgress();
let currentEra = 'all';
let currentChapterId = null;
let chapterSectionIndex = 0;
let chapterQuestionIndex = 0;
let orderItems = shuffle([966, 1410, 1569, 1795, 1918, 1939, 1980, 1989]);
let selectedPowers = new Set();
let memoryState = buildMemory();
let flipped = [];

function loadProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const currentIds = new Set(chapters.map(chapter => chapter.id));
    const completed = Object.fromEntries(Object.entries(stored.completed || {}).filter(([id, value]) => currentIds.has(id) && value));
    const answeredQuestions = Object.fromEntries(Object.entries(stored.answeredQuestions || {}).filter(([id]) => currentIds.has(id)));
    const legacyCompleted = [...new Set([
      ...(stored.legacyCompleted || []),
      ...Object.entries(stored.completed || {}).filter(([id, value]) => value && legacyProgressMap[id]).map(([id]) => legacyProgressMap[id]),
    ])];
    const achievements = { ...(stored.achievements || {}) };
    if (legacyCompleted.length) achievements['legacy-learner'] = true;
    return { ...defaultProgress, ...stored, completed, achievements, answeredQuestions, legacyCompleted };
  } catch {
    return structuredClone(defaultProgress);
  }
}
function saveProgress() { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); renderProgress(); }
function shuffle(values) { return [...values].sort(() => Math.random() - 0.5); }
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
      <section id="games" class="section alt"><div class="inner"><div class="section-title"><div><div class="kicker">Retrieval practice</div><h2>Make the chronology and concepts stick</h2></div></div><div class="game-layout"><div class="card"><h3>Timeline ordering</h3><p>Move these events into chronological order.</p><div class="drag-list" id="orderGame"></div><button class="btn btn-primary" id="checkOrder">Check order</button><div class="feedback" id="orderFeedback" aria-live="polite"></div></div><div class="card"><h3>Partition puzzle</h3><p>Select the three powers that partitioned the Commonwealth.</p><div class="partition-grid" id="partitionGame"></div><button class="btn btn-primary" id="checkPartition">Check powers</button><div class="feedback" id="partitionFeedback" aria-live="polite"></div></div></div><div class="card" style="margin-top:1rem"><h3>Memory match: ideas and meanings</h3><p>Match each historical concept with its meaning.</p><div class="memory-grid" id="memoryGame"></div><div class="feedback" id="memoryFeedback" aria-live="polite"></div></div></div></section>
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
      renderAll();
    }
  });
  document.getElementById('exportBtn').addEventListener('click', async () => {
    const summary = `Polish History Quest: ${pct()}% complete, ${Object.keys(progress.completed).length}/${chapters.length} chapters, score ${progress.score}.`;
    await navigator.clipboard?.writeText(summary);
    alert(summary);
  });
  document.getElementById('checkOrder').addEventListener('click', checkOrder);
  document.getElementById('checkPartition').addEventListener('click', checkPartition);
}

function renderAll() { renderProgress(); renderEras(); renderTimeline(); renderOrder(); renderPartition(); renderMemory(); }

function renderProgress() {
  const percent = pct();
  const fill = document.getElementById('progressFill'); if (fill) fill.style.width = `${percent}%`;
  const score = document.getElementById('score'); if (score) score.textContent = `Score ${progress.score} · Streak ${progress.streak}`;
  const text = document.getElementById('progressText'); if (text) text.textContent = `${Object.keys(progress.completed).length} of ${chapters.length} chapters completed (${percent}%). A chapter completes after all of its questions are answered correctly.`;
  const achievements = [
    ['founder', 'Early Poland'], ['commonwealth', 'Commonwealth thinker'], ['partition', 'Partition solver'],
    ['war-memory', 'Memory with care'], ['solidarity', 'Solidarity scholar'], ['chronologist', 'Chronologist'],
    ['memory', 'Memory master'], ['streak', 'Learning streak'], ['legacy-learner', 'Original curriculum learner'], ['graduate', 'Curriculum complete'],
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
  const hash = [...item.prompt].reduce((total, char) => (total + char.charCodeAt(0)) % item.options.length, 0);
  const indexed = item.options.map((text, originalIndex) => ({ text, originalIndex }));
  return indexed.slice(hash).concat(indexed.slice(0, hash));
}

function renderChapterQuiz(chapter) {
  const answers = progress.answeredQuestions[chapter.id] || {};
  const item = chapter.quiz[chapterQuestionIndex];
  const optionDisplay = displayedQuestionOptions(item);
  const selected = answers[chapterQuestionIndex];
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
  progress.answeredQuestions[chapter.id][questionIndex] = { choice, correct };
  if (correct) {
    addScore(40);
  } else {
    miss();
    // Keep the explanation visible now; allow retry after navigating or reopening.
    setTimeout(() => {
      if (progress.answeredQuestions[chapter.id]?.[questionIndex]?.correct === false) {
        delete progress.answeredQuestions[chapter.id][questionIndex];
        saveProgress();
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

function renderOrder() {
  const names = {
    966: '966 — Baptism of Mieszko I', 1410: '1410 — Battle of Grunwald', 1569: '1569 — Union of Lublin',
    1795: '1795 — Third Partition', 1918: '1918 — Independence restored', 1939: '1939 — Dual invasion',
    1980: '1980 — Solidarity founded', 1989: '1989 — Round Table transition',
  };
  document.getElementById('orderGame').innerHTML = orderItems.map((year, index) => `<div class="order-item"><span>${names[year]}</span><span class="order-controls"><button data-dir="up" data-i="${index}" aria-label="Move ${year} up">↑</button><button data-dir="down" data-i="${index}" aria-label="Move ${year} down">↓</button></span></div>`).join('');
  document.querySelectorAll('.order-controls button').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.i); const target = button.dataset.dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= orderItems.length) return;
    [orderItems[index], orderItems[target]] = [orderItems[target], orderItems[index]]; renderOrder();
  }));
}
function checkOrder() {
  const correct = orderItems.every((value, index, values) => index === 0 || values[index - 1] < value);
  document.getElementById('orderFeedback').textContent = correct ? 'Correct—the long chronology is in place.' : 'Some events remain out of order. Use the dates and try again.';
  if (correct && !progress.orderedWin) { progress.orderedWin = true; award('chronologist'); addScore(150); } else if (!correct) miss();
}

function renderPartition() {
  const powers = ['Russia', 'Prussia', 'Austria', 'France', 'Sweden', 'Ottoman Empire'];
  document.getElementById('partitionGame').innerHTML = powers.map(power => `<button class="choice ${selectedPowers.has(power) ? 'selected' : ''}" data-power="${power}">${power}</button>`).join('');
  document.querySelectorAll('#partitionGame .choice').forEach(button => button.addEventListener('click', () => { const power = button.dataset.power; selectedPowers.has(power) ? selectedPowers.delete(power) : selectedPowers.add(power); renderPartition(); }));
}
function checkPartition() {
  const correctPowers = ['Russia', 'Prussia', 'Austria'];
  const correct = correctPowers.every(power => selectedPowers.has(power)) && selectedPowers.size === 3;
  document.getElementById('partitionFeedback').textContent = correct ? 'Correct. Internal weakness mattered, but these three empires used military power to partition the Commonwealth.' : 'Not quite. Select exactly three neighbouring empires of the late eighteenth century.';
  if (correct && !progress.partitionWin) { progress.partitionWin = true; award('partition'); addScore(150); } else if (!correct) miss();
}

function buildMemory() { return shuffle(memoryPairs.flatMap(([term, definition], id) => [{ id, type: 'term', text: term }, { id, type: 'definition', text: definition }])).map((card, key) => ({ ...card, key, flipped: false, matched: false })); }
function renderMemory() {
  document.getElementById('memoryGame').innerHTML = memoryState.map(card => `<button class="memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}" data-key="${card.key}">${card.flipped || card.matched ? card.text : '?'}</button>`).join('');
  document.querySelectorAll('.memory-card').forEach(button => button.addEventListener('click', () => flipCard(Number(button.dataset.key))));
}
function flipCard(key) {
  const card = memoryState.find(item => item.key === key);
  if (!card || card.matched || card.flipped || flipped.length === 2) return;
  card.flipped = true; flipped.push(card); renderMemory();
  if (flipped.length === 2) setTimeout(() => {
    const [first, second] = flipped;
    if (first.id === second.id && first.type !== second.type) {
      first.matched = second.matched = true;
      document.getElementById('memoryFeedback').textContent = 'Match found.';
      if (memoryState.every(item => item.matched) && !progress.memoryWin) { progress.memoryWin = true; award('memory'); addScore(200); document.getElementById('memoryFeedback').textContent = 'All matched—memory master!'; }
    } else {
      first.flipped = second.flipped = false; document.getElementById('memoryFeedback').textContent = 'No match—try another pair.'; miss();
    }
    flipped = []; renderMemory();
  }, 650);
}

function mapSvg() {
  return `<svg class="map-svg" viewBox="0 0 720 360" role="img" aria-label="Abstract map-like visualization of Poland's changing borders"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#c1121f"/><stop offset="1" stop-color="#d6a545"/></linearGradient></defs><rect width="720" height="360" rx="24" fill="#f7f1e8"/><path d="M175 105 C230 35 326 58 363 92 C411 136 491 103 540 160 C590 218 548 297 462 304 C383 310 353 270 281 287 C206 304 138 259 132 195 C128 158 151 135 175 105Z" fill="white" stroke="#14213d" stroke-width="5"/><path d="M210 145 C270 105 318 124 360 155 C399 184 457 174 498 213" fill="none" stroke="url(#g)" stroke-width="16" stroke-linecap="round" opacity=".9"/><circle cx="300" cy="160" r="14" fill="#c1121f"/><circle cx="425" cy="210" r="14" fill="#d6a545"/><text x="42" y="58" font-size="22" font-weight="800" fill="#14213d">Borders shift. People adapt.</text><text x="42" y="88" font-size="14" fill="#6f675d">A map-inspired learning surface, not a territorial claim.</text></svg>`;
}

app();
