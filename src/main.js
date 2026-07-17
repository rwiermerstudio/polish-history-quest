import './styles.css';

const STORAGE_KEY = 'polish-history-quest-progress-v1';

const eras = [
  { id:'origins', years:'966–1385', title:'Origins and Piast Poland', key:'Christianization made Poland legible to Latin Europe.', text:'The conventional starting point is 966, when Duke Mieszko I accepted Christianity. This did not instantly create a modern nation, but it placed the Piast realm into the diplomatic, religious and written world of Latin Christendom.', question:'Why is 966 usually treated as a turning point?', options:['It marks Poland joining Latin Christendom','It was the first partition of Poland','It was the start of communist rule'], answer:0 },
  { id:'commonwealth', years:'1385–1795', title:'Jagiellonian Union and Commonwealth', key:'A huge elective monarchy with a powerful noble political culture.', text:'The Polish-Lithuanian union grew into one of early modern Europe’s largest states. Its political system gave unusual rights to the nobility, while its religious and ethnic diversity made it very different from later nation-states.', question:'What made the Commonwealth unusual?', options:['It was an elective, multi-ethnic noble republic/monarchy','It was ruled from Moscow','It had no cities or trade'], answer:0 },
  { id:'partitions', years:'1772–1918', title:'Partitions and life without a state', key:'Poland disappeared from the map but not from culture or politics.', text:'In 1772, 1793 and 1795 Russia, Prussia and Austria partitioned the Commonwealth. For 123 years there was no sovereign Polish state, yet language, culture, uprisings and social institutions kept political identity alive.', question:'Which powers partitioned Poland?', options:['Russia, Prussia and Austria','France, Spain and Britain','Sweden, Denmark and Norway'], answer:0 },
  { id:'rebirth', years:'1918–1939', title:'Second Republic', key:'Independence returned, but borders, minorities and institutions were hard problems.', text:'After the First World War Poland returned as an independent state. The Second Republic faced border wars, economic reconstruction, ethnic diversity and competing visions of democracy and authority.', question:'What happened in 1918?', options:['Poland regained independence','Poland joined the EU','The Warsaw Uprising began'], answer:0 },
  { id:'war', years:'1939–1945', title:'War, occupation and destruction', key:'Nazi and Soviet occupations devastated Polish society, including the Holocaust.', text:'Germany and the Soviet Union invaded in 1939. Occupation brought terror, forced labour, mass murder, the Holocaust, resistance, and the destruction of Warsaw after the 1944 uprising.', question:'What best describes wartime Poland?', options:['Dual occupation, resistance, genocide and enormous destruction','A neutral country untouched by war','A colonial empire overseas'], answer:0 },
  { id:'solidarity', years:'1945–2004', title:'Communism, Solidarity and Europe', key:'Civic resistance helped move Poland from Soviet-bloc rule to democratic Europe.', text:'After 1945 Poland became a communist state in the Soviet sphere. Economic frustration, the Catholic Church, workers’ activism and the Solidarity movement helped force negotiated transition in 1989. Poland joined NATO in 1999 and the EU in 2004.', question:'Why is Solidarity important?', options:['It was a mass social movement that challenged communist rule','It was a medieval dynasty','It was one of the partitioning empires'], answer:0 }
];

const events = [
  { year:966, era:'origins', title:'Baptism of Mieszko I', text:'A symbolic beginning of Polish statehood in Latin Christian Europe.' },
  { year:1025, era:'origins', title:'Coronation of Bolesław I', text:'Royal authority strengthened the Piast realm.' },
  { year:1385, era:'commonwealth', title:'Union of Krewo', text:'Dynastic union links Poland and Lithuania.' },
  { year:1569, era:'commonwealth', title:'Union of Lublin', text:'Creates the Polish-Lithuanian Commonwealth.' },
  { year:1683, era:'commonwealth', title:'Relief of Vienna', text:'Jan III Sobieski helps defeat the Ottoman siege.' },
  { year:1772, era:'partitions', title:'First Partition', text:'Russia, Prussia and Austria seize Commonwealth territory.' },
  { year:1791, era:'partitions', title:'Constitution of 3 May', text:'A major reform attempt, often called Europe’s first modern written constitution.' },
  { year:1795, era:'partitions', title:'Third Partition', text:'The Polish-Lithuanian Commonwealth disappears from the map.' },
  { year:1918, era:'rebirth', title:'Independence restored', text:'Poland re-emerges after the First World War.' },
  { year:1920, era:'rebirth', title:'Battle of Warsaw', text:'Poland defeats the Red Army near Warsaw.' },
  { year:1939, era:'war', title:'Invasion and occupation', text:'Germany and the Soviet Union invade Poland.' },
  { year:1943, era:'war', title:'Warsaw Ghetto Uprising', text:'Jewish resistance against Nazi deportation and extermination.' },
  { year:1944, era:'war', title:'Warsaw Uprising', text:'The Home Army attempts to liberate Warsaw before Soviet arrival.' },
  { year:1980, era:'solidarity', title:'Solidarity founded', text:'A trade union becomes a mass civic movement.' },
  { year:1989, era:'solidarity', title:'Round Table and elections', text:'Negotiated transition begins the end of communist rule.' },
  { year:2004, era:'solidarity', title:'EU accession', text:'Poland joins the European Union.' }
];

const memoryPairs = [
  ['Commonwealth','Polish-Lithuanian elective state'], ['Partitions','Division by neighbouring empires'], ['Solidarity','Independent trade union and civic movement'], ['3 May Constitution','Reform attempt in 1791'], ['Home Army','Underground resistance in WWII'], ['EU 2004','Poland joins European Union']
];

const defaultProgress = { completed: {}, score: 0, attempts: 0, streak: 0, achievements: {}, orderedWin:false, partitionWin:false, memoryWin:false };
let progress = loadProgress();
let currentEra = 'all';
let orderItems = shuffle([966, 1569, 1795, 1918, 1939, 1989]);
let selectedPowers = new Set();
let memoryState = buildMemory();
let flipped = [];

function loadProgress(){ try { return { ...defaultProgress, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; } catch { return { ...defaultProgress }; } }
function saveProgress(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); renderProgress(); }
function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5); }
function pct(){ return Math.round((Object.keys(progress.completed).length / eras.length) * 100); }
function award(id){ progress.achievements[id]=true; }
function addScore(n){ progress.score += n; progress.streak += 1; if(progress.streak>=3) award('streak'); saveProgress(); }
function miss(){ progress.attempts += 1; progress.streak = 0; saveProgress(); }

function app(){
  document.querySelector('#app').innerHTML = `
    <div class="app">
      <header class="header"><nav class="nav"><div class="brand"><span class="eagle">♜</span><span>Polish History Quest</span></div><div class="navlinks"><a href="#eras">Eras</a><a href="#timeline">Timeline</a><a href="#games">Games</a><a href="#progress">Progress</a><button class="small-btn" id="exportBtn">Copy progress</button><button class="small-btn" id="resetBtn">Reset</button></div></nav></header>
      <section class="hero"><div><span class="badge">Interactive static learning game</span><h1>Learn Poland’s history by playing through its turning points.</h1><p class="lead">A concise, adult-friendly journey from early statehood through the Polish-Lithuanian Commonwealth, partitions, war, communism, Solidarity and European integration.</p><div class="cta-row"><button class="btn btn-primary" data-scroll="eras">Start the path</button><button class="btn btn-secondary" data-scroll="games">Try a mini-game</button></div></div><div class="hero-card map-card">${mapSvg()}<div class="float-stat"><div class="stat"><b>${events.length}</b><span>timeline events</span></div><div class="stat"><b>${eras.length}</b><span>learning chapters</span></div><div class="stat"><b id="heroPct">${pct()}%</b><span>complete</span></div></div></div></section>
      <section id="progress" class="section"><div class="section-title"><div><div class="kicker">Your journey</div><h2>Progress that stays in your browser</h2></div><strong id="score"></strong></div><div class="progress-shell"><div id="progressFill" class="progress-fill"></div></div><p class="lead" id="progressText"></p><div class="achievement-list" id="achievements"></div></section>
      <section id="eras" class="section alt"><div class="inner"><div class="section-title"><div><div class="kicker">Guided path</div><h2>Six chapters, from 966 to 2004</h2></div></div><div class="grid eras" id="eraGrid"></div></div></section>
      <section id="timeline" class="section"><div class="section-title"><div><div class="kicker">Visual sequence</div><h2>Timeline of turning points</h2></div><select id="eraFilter" aria-label="Filter timeline by era"><option value="all">All eras</option>${eras.map(e=>`<option value="${e.id}">${e.title}</option>`).join('')}</select></div><div class="timeline" id="timelineList"></div></section>
      <section id="games" class="section alt"><div class="inner"><div class="section-title"><div><div class="kicker">Mini-games</div><h2>Make the facts stick</h2></div></div><div class="game-layout"><div class="card"><h3>Timeline ordering</h3><p>Move the events into chronological order.</p><div class="drag-list" id="orderGame"></div><button class="btn btn-primary" id="checkOrder">Check order</button><div class="feedback" id="orderFeedback"></div></div><div class="card"><h3>Partition puzzle</h3><p>Select the three powers that partitioned Poland.</p><div class="partition-grid" id="partitionGame"></div><button class="btn btn-primary" id="checkPartition">Check powers</button><div class="feedback" id="partitionFeedback"></div></div></div><div class="card" style="margin-top:1rem"><h3>Memory match: ideas and meanings</h3><p>Match the historical concept with its meaning.</p><div class="memory-grid" id="memoryGame"></div><div class="feedback" id="memoryFeedback"></div></div></div></section>
      <footer class="footer">Static app. No backend. Progress is saved only in this browser.</footer>
      <div class="chapter-modal" id="modal"><div class="modal-panel"><div class="modal-head"><div><span class="badge" id="modalYears"></span><h2 id="modalTitle"></h2></div><button class="close" id="modalClose">×</button></div><p class="lead" id="modalText"></p><div class="card"><h3 id="quizQuestion"></h3><div class="quiz-options" id="quizOptions"></div><div class="feedback" id="quizFeedback"></div></div></div></div>
    </div>`;
  bind(); renderAll();
}

function bind(){
  document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.scroll).scrollIntoView({behavior:'smooth'})));
  document.getElementById('eraFilter').addEventListener('change', e=>{ currentEra=e.target.value; renderTimeline(); });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('resetBtn').addEventListener('click',()=>{ if(confirm('Reset your local progress?')){ progress={...defaultProgress}; localStorage.removeItem(STORAGE_KEY); renderAll(); }});
  document.getElementById('exportBtn').addEventListener('click', async()=>{ const summary=`Polish History Quest progress: ${pct()}% complete, score ${progress.score}, achievements ${Object.keys(progress.achievements).join(', ') || 'none'}`; await navigator.clipboard?.writeText(summary); alert(summary); });
  document.getElementById('checkOrder').addEventListener('click', checkOrder);
  document.getElementById('checkPartition').addEventListener('click', checkPartition);
}

function renderAll(){ renderProgress(); renderEras(); renderTimeline(); renderOrder(); renderPartition(); renderMemory(); }
function renderProgress(){
  const percent = pct();
  const pf=document.getElementById('progressFill'); if(pf) pf.style.width=percent+'%';
  const hp=document.getElementById('heroPct'); if(hp) hp.textContent=percent+'%';
  const score=document.getElementById('score'); if(score) score.textContent=`Score ${progress.score} · Streak ${progress.streak}`;
  const pt=document.getElementById('progressText'); if(pt) pt.textContent=`${Object.keys(progress.completed).length} of ${eras.length} chapters completed. Your progress is stored locally in this browser.`;
  const ach = [ ['founder','Statehood starter'], ['commonwealth','Commonwealth thinker'], ['partition','Partition solver'], ['chronologist','Chronologist'], ['memory','Memory master'], ['streak','Learning streak'] ];
  const el=document.getElementById('achievements'); if(el) el.innerHTML = ach.map(([id,label])=>`<span class="achievement ${progress.achievements[id]?'unlocked':''}">${progress.achievements[id]?'★':'☆'} ${label}</span>`).join('');
}
function renderEras(){ document.getElementById('eraGrid').innerHTML = eras.map(e=>`<article class="card era-card ${progress.completed[e.id]?'done':''}" data-era="${e.id}"><div class="era-meta"><span class="pill">${e.years}</span><span class="pill">${e.key}</span></div><h3>${e.title}</h3><p>${e.text.slice(0,150)}…</p></article>`).join(''); document.querySelectorAll('.era-card').forEach(c=>c.addEventListener('click',()=>openEra(c.dataset.era))); }
function renderTimeline(){ const list = currentEra==='all'?events:events.filter(e=>e.era===currentEra); document.getElementById('timelineList').innerHTML=list.map(e=>`<div class="event"><span class="event-dot"></span><div class="card"><time>${e.year}</time><h3>${e.title}</h3><p>${e.text}</p></div></div>`).join(''); }
function openEra(id){ const e=eras.find(x=>x.id===id); document.getElementById('modalYears').textContent=e.years; document.getElementById('modalTitle').textContent=e.title; document.getElementById('modalText').textContent=e.text; document.getElementById('quizQuestion').textContent=e.question; document.getElementById('quizOptions').innerHTML=e.options.map((o,i)=>`<button class="option" data-i="${i}">${o}</button>`).join(''); document.getElementById('quizFeedback').textContent=''; document.querySelectorAll('#quizOptions .option').forEach(o=>o.addEventListener('click',()=>answerEra(e, Number(o.dataset.i), o))); document.getElementById('modal').classList.add('open'); }
function closeModal(){ document.getElementById('modal').classList.remove('open'); }
function answerEra(e, i, btn){ document.querySelectorAll('#quizOptions .option').forEach(x=>x.disabled=true); if(i===e.answer){ btn.classList.add('correct'); document.getElementById('quizFeedback').textContent='Correct. Chapter complete.'; progress.completed[e.id]=true; if(e.id==='origins') award('founder'); if(e.id==='commonwealth') award('commonwealth'); addScore(100); renderEras(); } else { btn.classList.add('wrong'); document.getElementById('quizFeedback').textContent='Not quite. Re-read the short text and try another chapter.'; miss(); } }
function renderOrder(){ const names = {966:'966 — Baptism of Mieszko I',1569:'1569 — Union of Lublin',1795:'1795 — Third Partition',1918:'1918 — Independence restored',1939:'1939 — Invasion and occupation',1989:'1989 — Round Table transition'}; document.getElementById('orderGame').innerHTML=orderItems.map((y,i)=>`<div class="order-item"><span>${names[y]}</span><span class="order-controls"><button data-dir="up" data-i="${i}">↑</button><button data-dir="down" data-i="${i}">↓</button></span></div>`).join(''); document.querySelectorAll('.order-controls button').forEach(b=>b.addEventListener('click',()=>{ const i=Number(b.dataset.i), j=b.dataset.dir==='up'?i-1:i+1; if(j<0||j>=orderItems.length) return; [orderItems[i],orderItems[j]]=[orderItems[j],orderItems[i]]; renderOrder(); })); }
function checkOrder(){ const ok=orderItems.every((v,i,a)=>i===0||a[i-1]<v); const f=document.getElementById('orderFeedback'); if(ok){ f.textContent='Correct — you have the basic chronology.'; progress.orderedWin=true; award('chronologist'); addScore(150); } else { f.textContent='Some events are out of order. Look at the dates and try again.'; miss(); } }
function renderPartition(){ const powers=['Russia','Prussia','Austria','France','Sweden','Ottoman Empire']; document.getElementById('partitionGame').innerHTML=powers.map(p=>`<button class="choice ${selectedPowers.has(p)?'selected':''}" data-power="${p}">${p}</button>`).join(''); document.querySelectorAll('#partitionGame .choice').forEach(b=>b.addEventListener('click',()=>{ const p=b.dataset.power; selectedPowers.has(p)?selectedPowers.delete(p):selectedPowers.add(p); renderPartition(); })); }
function checkPartition(){ const correct=['Russia','Prussia','Austria']; const ok=correct.every(p=>selectedPowers.has(p)) && selectedPowers.size===3; const f=document.getElementById('partitionFeedback'); if(ok){ f.textContent='Correct: Russia, Prussia and Austria partitioned the Commonwealth.'; progress.partitionWin=true; award('partition'); addScore(150); } else { f.textContent='Try again: think of Poland’s three powerful neighbours in the late 18th century.'; miss(); } }
function buildMemory(){ return shuffle(memoryPairs.flatMap(([a,b],idx)=>[{id:idx,type:'term',text:a},{id:idx,type:'def',text:b}])).map((c,i)=>({...c, key:i, flipped:false, matched:false})); }
function renderMemory(){ document.getElementById('memoryGame').innerHTML=memoryState.map(c=>`<button class="memory-card ${c.flipped?'flipped':''} ${c.matched?'matched':''}" data-key="${c.key}">${c.flipped||c.matched?c.text:'?'}</button>`).join(''); document.querySelectorAll('.memory-card').forEach(b=>b.addEventListener('click',()=>flipCard(Number(b.dataset.key)))); }
function flipCard(key){ const c=memoryState.find(x=>x.key===key); if(!c||c.matched||c.flipped||flipped.length===2) return; c.flipped=true; flipped.push(c); if(flipped.length===2){ setTimeout(()=>{ const [a,b]=flipped; if(a.id===b.id && a.type!==b.type){ a.matched=b.matched=true; document.getElementById('memoryFeedback').textContent='Match found.'; if(memoryState.every(x=>x.matched)){ award('memory'); addScore(200); document.getElementById('memoryFeedback').textContent='All matched — memory master!'; } } else { a.flipped=b.flipped=false; document.getElementById('memoryFeedback').textContent='No match — try again.'; miss(); } flipped=[]; renderMemory(); }, 650); } renderMemory(); }
function mapSvg(){ return `<svg class="map-svg" viewBox="0 0 720 360" role="img" aria-label="Abstract map-like visualization of Poland's changing borders"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#c1121f"/><stop offset="1" stop-color="#d6a545"/></linearGradient></defs><rect width="720" height="360" rx="24" fill="#f7f1e8"/><path d="M175 105 C230 35 326 58 363 92 C411 136 491 103 540 160 C590 218 548 297 462 304 C383 310 353 270 281 287 C206 304 138 259 132 195 C128 158 151 135 175 105Z" fill="white" stroke="#14213d" stroke-width="5"/><path d="M210 145 C270 105 318 124 360 155 C399 184 457 174 498 213" fill="none" stroke="url(#g)" stroke-width="16" stroke-linecap="round" opacity=".9"/><circle cx="300" cy="160" r="14" fill="#c1121f"/><circle cx="425" cy="210" r="14" fill="#d6a545"/><text x="42" y="58" font-size="22" font-weight="800" fill="#14213d">Borders shift. Ideas persist.</text><text x="42" y="88" font-size="14" fill="#6f675d">A map-inspired learning surface, not a territorial claim.</text></svg>`; }

app();
