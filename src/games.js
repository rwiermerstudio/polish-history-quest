export const chronicleRounds = [
  {
    id: 'realm-to-commonwealth',
    title: 'From Piast realm to Commonwealth',
    chapterIds: ['lands-before-poland', 'fragmentation-reunification', 'jagiellonian-union', 'commonwealth'],
    briefing: 'Reconstruct the chain of state formation, dynastic union and constitutional change. Dates are hidden; use causation and institutional development.',
    events: [
      { id: 'baptism', year: 966, title: 'Mieszko enters Latin Christianity', clue: 'This precedes both a Polish royal coronation and the independent church structure at Gniezno.' },
      { id: 'gniezno', year: 1000, title: 'An emperor meets Bolesław at Gniezno', clue: 'The cult of Saint Adalbert becomes an instrument of diplomacy and ecclesiastical organization.' },
      { id: 'grunwald', year: 1410, title: 'Polish–Lithuanian forces defeat the Teutonic Order', clue: 'This occurs after the dynastic union but long before the two polities create a Commonwealth.' },
      { id: 'lublin', year: 1569, title: 'The Union of Lublin creates a joint Commonwealth', clue: 'A shared parliament and elected monarch now link the Crown and Grand Duchy more tightly.' },
      { id: 'confederation', year: 1573, title: 'The Warsaw Confederation protects religious peace', clue: 'This compact answers uncertainty at the opening of the first royal interregnum.' },
    ],
  },
  {
    id: 'crisis-and-partitions',
    title: 'Crisis, reform and the loss of sovereignty',
    chapterIds: ['commonwealth', 'crisis-reform', 'partitions-napoleon', 'long-nineteenth-century'],
    briefing: 'Follow the Commonwealth from frontier revolt through invasion, reform, partition and a new style of national resistance.',
    events: [
      { id: 'khmelnytsky', year: 1648, title: 'The Khmelnytsky uprising transforms the eastern frontier', clue: 'Cossack autonomy, Orthodox grievance, social conflict and regional violence collide before the Swedish invasion.' },
      { id: 'deluge', year: 1655, title: 'Swedish armies overrun much of the Commonwealth', clue: 'This invasion follows the Cossack revolt and deepens a demographic and fiscal crisis.' },
      { id: 'constitution', year: 1791, title: 'Reformers adopt the Constitution of 3 May', clue: 'This attempt to strengthen government comes after the first partition but before sovereignty disappears.' },
      { id: 'third-partition', year: 1795, title: 'The third partition removes the Commonwealth from the map', clue: 'Military defeat ends the reform era and shifts politics toward life under three empires.' },
      { id: 'january', year: 1863, title: 'An underground national government launches the January Uprising', clue: 'This romantic insurrection belongs to the later partition era of railways, censorship and mass politics.' },
    ],
  },
  {
    id: 'war-to-democracy',
    title: 'Independence, occupation and democratic opposition',
    chapterIds: ['war-and-independence', 'second-republic', 'world-war-two', 'protest-solidarity', 'third-republic'],
    briefing: 'Build a modern chronology in which restored sovereignty, occupation, social resistance and negotiation are distinct turning points.',
    events: [
      { id: 'independence', year: 1918, title: 'A Polish republic returns amid imperial collapse', clue: 'This is followed by border wars and the difficult integration of three former imperial systems.' },
      { id: 'dual-invasion', year: 1939, title: 'Germany and the Soviet Union invade from opposite directions', clue: 'The attack destroys the Second Republic and begins two occupation systems.' },
      { id: 'ghetto-uprising', year: 1943, title: 'Jewish fighters resist liquidation of the Warsaw Ghetto', clue: 'This occurs before the separate Home Army uprising across Warsaw.' },
      { id: 'solidarity', year: 1980, title: 'An independent trade union becomes a mass social movement', clue: 'Its legal existence is soon interrupted by martial law, but underground organization survives.' },
      { id: 'round-table', year: 1989, title: 'Negotiations open the way to partly free elections', clue: 'This negotiated breakthrough begins the transition before NATO and European Union accession.' },
    ],
  },
];

export const councilScenarios = [
  {
    id: 'lublin-union', chapterId: 'commonwealth', era: 'Union parliament', title: 'A federation under pressure',
    context: 'The Crown and Grand Duchy face war with Muscovy. Delegates disagree over how much sovereignty a closer union should preserve.',
    prompt: 'What settlement will you press through the Sejm?',
    options: [
      { label: 'Negotiate shared institutions while preserving separate law and offices', effects: { authority: 8, treasury: -8, cohesion: 12, liberty: 6 }, consequence: 'A workable federation gains capacity without pretending the two partners have merged into one uniform state, but parallel institutions are costly to coordinate.' },
      { label: 'Centralize law, offices and taxation immediately under the Crown', effects: { authority: 18, treasury: 10, cohesion: -22, liberty: -16 }, consequence: 'Central capacity rises, but Lithuanian and Ruthenian elites see incorporation rather than partnership.' },
      { label: 'Keep only the personal union and postpone reform', effects: { authority: -10, treasury: -8, cohesion: 4, liberty: 8 }, consequence: 'Autonomy is preserved, but wartime coordination and common fiscal capacity remain weak.' },
    ],
  },
  {
    id: 'religious-peace', chapterId: 'commonwealth', era: 'Royal interregnum', title: 'Peace without a king',
    context: 'Confessional wars unsettle Europe while the Commonwealth enters an interregnum with a religiously diverse nobility and cities.',
    prompt: 'How will you secure the election?',
    options: [
      { label: 'Declare one confession a condition of political loyalty', effects: { authority: 10, treasury: 2, cohesion: -18, liberty: -24 }, consequence: 'Uniformity appeals to some clergy and magnates but threatens dissenting nobles and towns.' },
      { label: 'Bind electors to mutual religious peace', effects: { authority: -4, treasury: -4, cohesion: 16, liberty: 18 }, consequence: 'The compact lowers the risk of confessional civil war, though enforcement is costly and toleration remains unequal and incomplete.' },
      { label: 'Leave every locality to settle conflict independently', effects: { authority: -12, treasury: -4, cohesion: -8, liberty: 10 }, consequence: 'Local freedom grows, but there is no common guarantee against coercion during the interregnum.' },
    ],
  },
  {
    id: 'cossack-register', chapterId: 'crisis-reform', era: 'Eastern frontier', title: 'The Cossack question',
    context: 'Registered Cossacks seek status and pay; Orthodox communities contest religious and social subordination; magnate estates expand.',
    prompt: 'Which policy do you advocate before revolt becomes general war?',
    options: [
      { label: 'Use magnate forces to enforce the existing settlement', effects: { authority: 10, treasury: -4, cohesion: -24, liberty: -18 }, consequence: 'Short-term compliance hides deeper social, religious and political conflict.' },
      { label: 'Withdraw royal authority and let estate owners bargain separately', effects: { authority: -18, treasury: 4, cohesion: -10, liberty: 6 }, consequence: 'The centre saves money but loses leverage as local conflicts and private armies shape the frontier.' },
      { label: 'Expand the register and negotiate representation with Orthodox elites', effects: { authority: 4, treasury: -18, cohesion: 18, liberty: 10 }, consequence: 'The treasury strains, but recognition addresses political and confessional grievances instead of treating the frontier only as a security problem.' },
    ],
  },
  {
    id: 'fiscal-reform', chapterId: 'crisis-reform', era: 'Age of reform', title: 'A state that cannot pay',
    context: 'Neighbouring monarchies maintain larger standing armies. Sejm obstruction and foreign influence repeatedly block dependable taxation.',
    prompt: 'How will you build defensive capacity?',
    options: [
      { label: 'Give the monarch emergency taxes without oversight', effects: { authority: 24, treasury: 18, cohesion: -12, liberty: -24 }, consequence: 'Revenue arrives quickly, but opponents fear that reform has become absolutism.' },
      { label: 'Create regular taxation with parliamentary auditing', effects: { authority: 12, treasury: 22, cohesion: -8, liberty: 4 }, consequence: 'Capacity and accountability rise together, though privileged taxpayers resist the precedent and political cohesion suffers.' },
      { label: 'Rely on temporary levies and diplomatic guarantees', effects: { authority: -14, treasury: 8, cohesion: -4, liberty: 10 }, consequence: 'Privileges remain secure while military dependence on neighbouring powers deepens.' },
    ],
  },
  {
    id: 'may-constitution', chapterId: 'crisis-reform', era: 'Constitutional moment', title: 'Reform under the eyes of empires',
    context: 'The Four-Year Sejm has an opening to reform government, but domestic opponents and neighbouring powers can intervene.',
    prompt: 'What constitutional coalition will you build?',
    options: [
      { label: 'Abolish every estate and proclaim immediate universal democracy', effects: { authority: -8, treasury: -10, cohesion: -24, liberty: 24 }, consequence: 'The leap outruns the available coalition and makes foreign and domestic counter-mobilization easier.' },
      { label: 'Abandon reform to avoid provoking Russia and Prussia', effects: { authority: -18, treasury: -8, cohesion: 2, liberty: -4 }, consequence: 'Immediate confrontation is postponed, but institutional weakness and foreign leverage remain.' },
      { label: 'Strengthen government and urban rights through a broad reform coalition', effects: { authority: 16, treasury: -8, cohesion: 10, liberty: 12 }, consequence: 'The settlement improves capacity and citizenship while remaining an eighteenth-century constitutional monarchy, not universal democracy; implementation strains the treasury.' },
    ],
  },
];

export const archiveCases = [
  {
    id: 'partition-dossier', title: 'Casefile: Why did the Commonwealth disappear?',
    chapterIds: ['crisis-reform', 'partitions-napoleon'],
    brief: 'Select the three pieces of evidence most useful for testing a combined domestic-and-international explanation, then choose the strongest interpretation.',
    evidence: [
      { id: 'sejm-obstruction', label: 'Sejm records', text: 'Repeated obstruction prevented dependable taxation and military reform.', source: 'Institutional evidence' },
      { id: 'foreign-troops', label: 'Diplomatic dispatch', text: 'Russian troops and ambassadors intervened directly in Commonwealth politics.', source: 'International evidence' },
      { id: 'reform-reaction', label: 'Constitution and invasion', text: 'Reform in the Four-Year Sejm was followed by confederate opposition and foreign military intervention.', source: 'Causal sequence' },
      { id: 'anthem', label: 'Later patriotic song', text: 'The anthem insists that the nation could survive without a state.', source: 'Memory evidence' },
      { id: 'weather', label: 'Estate weather diary', text: 'Several winters brought poor local harvests.', source: 'Contextual fragment' },
    ],
    correctEvidence: ['sejm-obstruction', 'foreign-troops', 'reform-reaction'],
    interpretations: [
      { text: 'Institutional weakness and foreign coercion reinforced one another; neither alone explains the partitions.', correct: true },
      { text: 'One parliamentary rule mechanically caused all three partitions regardless of neighbouring powers.', correct: false },
      { text: 'The partitions were an uncontested modernization welcomed by Commonwealth society.', correct: false },
    ],
  },
  {
    id: 'occupation-dossier', title: 'Casefile: Responsibility under occupation',
    chapterIds: ['world-war-two'],
    brief: 'Build a precise account that names occupying regimes while preserving evidence of varied local choices.',
    evidence: [
      { id: 'german-system', label: 'Occupation decree', text: 'Nazi Germany designed the ghetto, deportation and killing-centre system in occupied Poland.', source: 'Perpetrator institution' },
      { id: 'state-destroyed', label: 'Government record', text: 'The Polish state was dismantled; an exile government and underground institutions continued resistance.', source: 'Political context' },
      { id: 'local-agency', label: 'Local testimony', text: 'Evidence documents rescue, indifference, blackmail and participation in violence by different individuals.', source: 'Microhistorical evidence' },
      { id: 'camp-location', label: 'Railway map', text: 'Major killing centres stood within occupied Polish territory.', source: 'Geographic evidence' },
      { id: 'postwar-film', label: 'Feature film', text: 'A post-war drama compresses several experiences into one fictional family.', source: 'Memory artifact' },
    ],
    correctEvidence: ['german-system', 'state-destroyed', 'local-agency'],
    interpretations: [
      { text: 'Name German state responsibility precisely, then investigate local conduct through specific evidence rather than collective labels.', correct: true },
      { text: 'Geographic location proves that a Polish state operated the German killing centres.', correct: false },
      { text: 'Occupation terror eliminates the need to study any individual choices or local violence.', correct: false },
    ],
  },
  {
    id: 'solidarity-dossier', title: 'Casefile: How did Solidarity survive?',
    chapterIds: ['protest-solidarity', 'third-republic'],
    brief: 'Distinguish the movement’s social roots, underground endurance and negotiated transition from a simple collapse story.',
    evidence: [
      { id: 'shipyard-demands', label: 'Strike demands', text: 'Workers linked wages and safety to independent unions, censorship and political rights.', source: 'Movement programme' },
      { id: 'underground-print', label: 'Clandestine newspaper', text: 'Underground publishing and local networks continued after martial law dismantled legal structures.', source: 'Organizational evidence' },
      { id: 'round-table', label: 'Negotiation protocol', text: 'Government and opposition bargained over legalization and partly free elections.', source: 'Transition evidence' },
      { id: 'papal-poster', label: 'Commemorative poster', text: 'A later image presents moral unity through religious symbolism.', source: 'Memory artifact' },
      { id: 'factory-output', label: 'Production table', text: 'One factory exceeded its monthly output target before the strike wave.', source: 'Narrow economic datum' },
    ],
    correctEvidence: ['shipyard-demands', 'underground-print', 'round-table'],
    interpretations: [
      { text: 'A broad workplace movement survived repression through networks and later entered a negotiated, uncertain transition.', correct: true },
      { text: 'Solidarity was solely a church organization with no workplace programme.', correct: false },
      { text: 'The communist government disappeared before any negotiations or elections occurred.', correct: false },
    ],
  },
];
