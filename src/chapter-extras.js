const commons = (id, type, title, file, caption, alt, license = 'Public domain', attribution = 'Wikimedia Commons source record', options = {}) => {
  const encoded = encodeURIComponent(file);
  return {
    id,
    type,
    title,
    src: `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encoded}${type === 'image' || type === 'map' ? '?width=1200' : ''}`,
    source: `https://commons.wikimedia.org/wiki/File:${encoded}`,
    license,
    attribution,
    caption,
    alt,
    ...options,
  };
};

export const chapterExtras = {
  'lands-before-poland': {
    deepDive: {
      kind: 'interpretation',
      title: 'How a dynasty became a realm',
      body: `The year 966 is memorable, but it is better understood as a strategic turning point than as the birthday of a modern nation. Mieszko I ruled through a dynasty, fortified centres and personal alliances. By accepting baptism in the Latin rite, he connected his court to Latin Christian institutions: clergy could write and administer, marriage diplomacy became easier, and the ruler gained a religious language of legitimacy. The decision did not instantly standardize belief, language or borders. Older practices persisted, and the people under Piast power did not all imagine themselves as members of one nation.

Power spread unevenly through forts, tribute, warfare and negotiation. Archaeology reveals strongholds, burials, imported objects and changing settlement patterns, while written accounts mostly come from outsiders or from later court authors. At the Congress of Gniezno in 1000, Emperor Otto III met Bolesław Chrobry at the shrine of the missionary Saint Adalbert. The meeting joined diplomacy, sacred memory and plans for an archbishopric that reduced dependence on German church structures. It demonstrated the Piast ruler’s importance without making him equal to the emperor in every respect.

Sources shape what can be said. Gallus Anonymus wrote in the early twelfth century to praise Bolesław III and instruct an elite audience. His dramatic stories preserve traditions, but they are not transparent recordings of tenth-century events. Historians therefore compare chronicles with archaeology, coins, charters and foreign testimony. This combination explains why early Poland is best seen as a changing political project: a Piast monarchy was assembled and defended over generations, while identities remained local, dynastic and Christian as well as increasingly connected to the name of Poland.`,
    },
    coverage: [
      { section: 'How a dynasty became a realm', evidence: 'Latin Christian institutions' },
      { section: 'How a dynasty became a realm', evidence: 'Congress of Gniezno in 1000' },
      { section: 'How a dynasty became a realm', evidence: 'forts, tribute, warfare and negotiation' },
      { section: 'How a dynasty became a realm', evidence: 'Gallus Anonymus' },
    ],
    media: [
      commons('gniezno-doors', 'image', 'The Gniezno Doors as visual argument', 'Gniezno Cathedral detail 02.jpg', 'A bronze panel from the twelfth-century doors narrates the life of Saint Adalbert. Read it not as a photograph of events but as a later statement about sacred authority, mission and Piast memory.', 'Detail of a bronze relief on the Gniezno Cathedral doors showing figures in a medieval narrative scene.'),
      commons('piast-map', 'map', 'The Piast realm under Mieszko I', 'Poland historical map AD 960 - 992.png', 'The shaded borders are a modern reconstruction, not a precise medieval survey. Use the map to ask where historians disagree and why frontiers were zones of influence rather than fixed lines.', 'Historical map reconstructing the changing Piast realm between about 960 and 992.', 'CC BY-SA 3.0', 'Poznaniak; modified by Bede'),
    ],
  },
  'fragmentation-reunification': {
    deepDive: {
      kind: 'interpretation',
      title: 'Fragmentation could also generate change',
      body: `Calling the period after 1138 an age of “division” is accurate politically but misleading if it suggests that everything declined. Rival Piast duchies competed for people, revenue and prestige. That competition could be destructive, yet it also encouraged rulers and bishops to found towns, invite settlers, grant markets and clarify law. Town charters influenced by Magdeburg law created defined courts, offices and obligations within a feudal order. They did not make towns democratic in a modern sense, but they gave merchants and craftspeople a more predictable institutional setting.

The Mongol invasion of 1241 exposed the vulnerability of fragmented defence and devastated parts of the south. At the same time, a territorial crusading state grew on the Baltic. The Teutonic Order had been invited to fight non-Christian Prussians, but it built its own durable state and later seized Pomerelia, contesting routes between the kingdom and the sea. These developments show why political geography mattered as much as dynastic genealogy.

Reunification was a long process rather than one triumphant event. Władysław Łokietek’s coronation in 1320 restored a royal title, but not every historically Polish-ruled territory returned to the crown. Casimir III then strengthened the monarchy through legal codification, castles, royal administration and a university foundation. His policies toward towns and Jewish communities also served a state-building economy, even as society remained hierarchical. Historians therefore pair the language of restoration with evidence of novelty: the kingdom reunited in the fourteenth century was more urban, legally articulated and institutionally ambitious than the monarchy divided two centuries earlier. Fragmentation and development happened together.`,
    },
    coverage: [
      { section: 'Fragmentation could also generate change', evidence: 'Fragmentation and development happened together' },
      { section: 'Fragmentation could also generate change', evidence: 'defined courts, offices and obligations' },
      { section: 'Fragmentation could also generate change', evidence: 'territorial crusading state' },
      { section: 'Fragmentation could also generate change', evidence: 'legal codification, castles, royal administration and a university foundation' },
    ],
    media: [
      commons('casimir-portrait', 'image', 'Casimir III remembered as a lawgiver', 'Casimir III the Great.PNG', 'This later portrait helped turn Casimir into the model of a prudent builder-king. Compare the visual ideal with the concrete institutions—courts, castles, towns and university—used to support that reputation.', 'Later painted portrait of Casimir III wearing a crown and royal robes.'),
      commons('casimir-assembly', 'image', 'A later artist imagines royal consultation', 'Wiec Kazimierz Wielki.jpg', 'This nineteenth-century image imagines an assembly under Casimir III. It is evidence for later ideals of a consulting lawgiver, not a direct record of a medieval meeting.', 'Historical illustration imagining Casimir III presiding over an outdoor political assembly.'),
    ],
  },
  'jagiellonian-union': {
    deepDive: {
      kind: 'interpretation',
      title: 'A union made by bargaining, not destiny',
      body: `The Polish-Lithuanian connection begun at Krewo in 1385 was a negotiated dynastic alliance, not an instant unitary nation-state. Jadwiga’s court sought a ruler and security; Jogaila needed allies against the Teutonic Order and rivals within Lithuania. His baptism and marriage linked two political communities whose elites continued to defend different laws, offices and interests. The arrangement survived because it could be renegotiated, not because all conflict disappeared.

The victory at Grunwald in 1410 weakened the Teutonic Order’s prestige but did not remove it from Baltic politics. In 1525 the Order’s Prussian branch was secularized, and the Prussian Homage made its duke a Polish fief-holder. The settlement looked favourable to the crown; its long-term danger emerged when dynastic inheritance joined ducal Prussia to Brandenburg, creating the base of a powerful future rival. Contingent choices can therefore acquire consequences that participants did not foresee.

Inside the kingdom, privileges and assemblies expanded noble influence. Nihil Novi in 1505 strengthened parliamentary consent among nobles, yet most peasants, townspeople and many other inhabitants lacked political rights. It was constitutional development without modern democracy. Nicolaus Copernicus likewise resists simple national labels. He served institutions in Royal Prussia, wrote in Latin and participated in a European scholarly world while remaining connected to the Polish crown. His life crossed local, Prussian, Polish, Latin-Christian and European identities. Seen together, union, parliament and scholarship reveal a region knitted by overlapping loyalties. The useful question is not “Which modern nation owned this past?” but “Which institutions and communities did historical actors serve, and how did those connections change?”`,
    },
    coverage: [
      { section: 'A union made by bargaining, not destiny', evidence: 'negotiated dynastic alliance' },
      { section: 'A union made by bargaining, not destiny', evidence: 'parliamentary consent among nobles' },
      { section: 'A union made by bargaining, not destiny', evidence: 'joined ducal Prussia to Brandenburg' },
      { section: 'A union made by bargaining, not destiny', evidence: 'local, Prussian, Polish, Latin-Christian and European identities' },
    ],
    media: [
      commons('lublin-map', 'map', 'The Commonwealth after the Union of Lublin', 'Map of Poland and Lithuania after the Union of Lublin (1569).jpg', 'This historical map makes the scale of the union visible—from the Baltic toward the Black Sea borderlands. Borders conceal internal jurisdictions, so compare territorial extent with the text’s emphasis on separate institutions.', 'Historical map of Poland and Lithuania after the Union of Lublin in 1569.'),
      commons('copernicus', 'image', 'Copernicus in a world of overlapping identities', 'Nikolaus Kopernikus.jpg', 'The famous portrait is later than Copernicus himself. Use it to consider how European science, Royal Prussian institutions and later national canons all claimed his memory.', 'Painted half-length portrait of Nicolaus Copernicus holding a small plant.'),
    ],
  },
  commonwealth: {
    deepDive: {
      kind: 'interpretation',
      title: 'Liberty depended on who counted as political',
      body: `The Commonwealth called itself a republic because the political nation of nobles elected kings, sent representatives to the Sejm and defended law against arbitrary monarchy. Golden Liberty protected extensive noble participation, but the word “liberty” had boundaries: most peasants, townspeople and minorities lacked equal political power. A small noble estate included magnates with private armies as well as modest landholders, so formal equality among nobles coexisted with enormous inequality of resources.

Religious diversity was unusually broad for early modern Europe. The Warsaw Confederation of 1573 offered an important elite guarantee of religious peace after the Jagiellonian dynasty ended. It did not create complete modern equality, and later Counter-Reformation pressures narrowed space for some Protestants. Jewish self-government, Orthodox institutions, Armenian and Muslim communities and many languages made the Commonwealth a shared but unequal political world.

Its economy linked local coercion to international trade. Western demand for grain made the Vistula and Gdańsk commercially important. Estate owners expanded folwark production and heavier peasant labour duties, so prosperity at the port could intensify unfreedom in the countryside. On the southeastern frontier, registered and unregistered Cossacks sought recognition, pay and autonomy while magnate expansion and state policy constrained them. These tensions were political, social and religious at once.

The Commonwealth’s achievement and vulnerability came from the same negotiated structure. Consent could restrain royal power and permit plural institutions; it could also make collective action difficult when powerful actors blocked taxation or reform. Understanding the system requires holding both sides together rather than celebrating tolerance without inequality or explaining later crisis as inevitable failure.`,
    },
    coverage: [
      { section: 'Liberty depended on who counted as political', evidence: 'most peasants, townspeople and minorities lacked equal political power' },
      { section: 'Liberty depended on who counted as political', evidence: 'elite guarantee of religious peace' },
      { section: 'Liberty depended on who counted as political', evidence: 'folwark production and heavier peasant labour duties' },
      { section: 'Liberty depended on who counted as political', evidence: 'Cossacks sought recognition, pay and autonomy' },
    ],
    media: [
      commons('commonwealth-map', 'map', 'A federated state on a continental scale', 'C. 1795 Poland and Lithuania (1569-1795).jpg', 'A nineteenth-century historical map reconstructs the Commonwealth’s territorial reach. Notice the distance between the Baltic and the southeastern frontier—and remember that the map cannot show estate, faith or language boundaries.', 'Historical map showing the territories of Poland and Lithuania during the Commonwealth era.'),
      commons('skarga-sermon', 'image', 'Matejko imagines political warning', 'Kazanie Skargi.jpg', 'Jan Matejko painted Piotr Skarga addressing the royal court centuries after the supposed scene. It is valuable evidence for nineteenth-century memory of Commonwealth politics, not a literal record of a sermon.', 'Jan Matejko painting of Piotr Skarga preaching before a crowded royal court.'),
    ],
  },
  'crisis-reform': {
    deepDive: {
      kind: 'interpretation',
      title: 'Why crisis did not make partition inevitable',
      body: `The mid-seventeenth-century wars were a compound catastrophe. The Khmelnytsky uprising combined Cossack autonomy, Orthodox grievances, social conflict, great-power politics and violence against several civilian groups, including Jews and Polish nobles. Muscovite and Swedish invasions followed. Population loss, destroyed towns and farms, military costs and distrust weakened the Commonwealth, but recovery and reform remained possible. Later partition was not pre-written in 1648.

Eighteenth-century weakness came from interaction. The liberum veto and magnate rivalry obstructed taxation and military coordination, while social inequality narrowed the constituency for reform. At the same time, Russia, Prussia and Austria intervened repeatedly to keep their neighbour dependent. An explanation focused only on “Polish disorder” excuses imperial aggression; one focused only on foreign conspiracy misses institutional problems that outsiders exploited.

The Great Sejm and Constitution of 3 May 1791 tried to create more effective constitutional government, limit some noble abuses and strengthen urban rights without establishing universal democracy. Reformers abolished the liberum veto and made executive authority more coherent, while retaining monarchy and an estate society. Their opponents formed the Targowica Confederation and sought Russian aid. Neighbouring empires then used military power before the new order could consolidate.

The partitions therefore followed choices, interests and force, not a natural death. They occurred despite a vigorous Enlightenment reform movement—schools, theatre, print, economic debate and constitutional experimentation. Asking why reform failed requires two scales at once: internal institutions determined what the state could mobilize; the European balance of power determined how much time reformers were allowed.`,
    },
    coverage: [
      { section: 'Why crisis did not make partition inevitable', evidence: 'Cossack autonomy, Orthodox grievances, social conflict, great-power politics' },
      { section: 'Why crisis did not make partition inevitable', evidence: 'institutional problems that outsiders exploited' },
      { section: 'Why crisis did not make partition inevitable', evidence: 'more effective constitutional government' },
      { section: 'Why crisis did not make partition inevitable', evidence: 'used military power before the new order could consolidate' },
    ],
    media: [
      commons('may-constitution', 'image', 'The Constitution of 3 May as remembered', 'Jan Matejko - Konstytucja 3 maja 1791.jpg', 'Matejko’s 1891 canvas turns reform into a crowded national drama. Identify who is celebrated, who is marginal and how a painting made a century later shaped constitutional memory.', 'Jan Matejko painting showing supporters of the Constitution of 3 May moving through Warsaw.'),
      commons('partition-map', 'map', 'A map made between the second and third partitions', '1794 Laurie and Whittle Map of Poland and Lithuania after Second Partition - Geographicus - Poland-lauriewhittle-1794.jpg', 'Published in 1794, this map captures a political geography already transformed by seizure and on the eve of further destruction. It is both geographic evidence and a snapshot of uncertainty.', 'A coloured 1794 map of Poland and Lithuania after the second partition.'),
    ],
  },
  'partitions-napoleon': {
    deepDive: {
      kind: 'interpretation',
      title: 'Living without a state did not mean living outside politics',
      body: `After 1795, inhabitants of the former Commonwealth entered three different imperial systems. Russian, Prussian and Austrian authorities imposed different laws, schools, taxes, military duties and economic connections. The partitions therefore transformed daily life beyond the loss of sovereignty. They also ensured that later Polish political movements developed under unequal conditions rather than following one common path.

Napoleon reopened possibility. Polish Legions fought beside France, and the Duchy of Warsaw created a reforming but dependent Napoleonic state. Its constitution, administration and legal code weakened estate privilege and ended personal serfdom. Yet peasants did not automatically receive land or full economic independence; military demands were heavy; and the duchy’s survival depended on French power. Reform and dependency were not opposites—they were features of the same experiment.

The Congress of Vienna preserved a reduced Kingdom of Poland linked to the Russian emperor, while Prussia and Austria retained other territories. This settlement frustrated hopes for sovereignty but also created institutions that later became sites of conflict. Political actors now debated whether liberation required foreign war, constitutional work, insurrection or social reform.

Józef Wybicki’s legion song captured a new solution to statelessness. The future anthem defines national persistence through collective action even without an existing state: “Poland has not yet perished, so long as we still live.” Its confidence should not erase disagreement over who belonged or what restored Poland should look like. The song is exciting precisely because it transformed political defeat into a promise of agency—one that later generations repeatedly reinterpreted.`,
    },
    coverage: [
      { section: 'Living without a state did not mean living outside politics', evidence: 'three different imperial systems' },
      { section: 'Living without a state did not mean living outside politics', evidence: 'reforming but dependent Napoleonic state' },
      { section: 'Living without a state did not mean living outside politics', evidence: 'did not automatically receive land or full economic independence' },
      { section: 'Living without a state did not mean living outside politics', evidence: 'national persistence through collective action even without an existing state' },
    ],
    media: [
      commons('duchy-map', 'map', 'The Duchy of Warsaw in Napoleon’s Europe', 'AGAD Duchy of Warsaw map 1812.png', 'This contemporary administrative map makes the duchy tangible as a governed territory, not merely a patriotic symbol. Its borders also reveal dependence on Napoleon’s changing military order.', 'Historical 1812 map of the Duchy of Warsaw with coloured administrative divisions.'),
      commons('anthem-1901', 'audio', 'Hear an early recording of the national anthem', 'Mazurek Dąbrowskiego (1901).ogg', 'A 1901 recording lets you hear how a legion song carried the idea of political survival during partition. Audio technology itself helped standardize national culture across imperial borders.', 'Audio recording of Mazurek Dąbrowskiego made in 1901.', 'Public domain', 'Wikimedia Commons source record', {
        mediaLabel: 'Listen · historical recording',
        textAlternative: 'A solo male voice sings in Polish through the hiss and narrow frequency range of an early recording. The first stanza and refrain mean, in English: “Poland has not yet perished while we remain alive. What foreign force has taken from us, we shall regain with the sword. March, march, Dąbrowski, from the Italian land to Poland; under your command we shall reunite with the nation.” The brisk mazurka rhythm turns political survival into a collective march.',
      }),
    ],
  },
  'long-nineteenth-century': {
    deepDive: {
      kind: 'interpretation',
      title: 'From noble insurrection to mass politics',
      body: `The failed November and January uprisings created a strategic argument that lasted for generations: did national goals require repeated armed revolt, or long-term social, educational and economic organization? Insurrection could internationalize the Polish cause and produce underground institutions, but defeat brought executions, exile, confiscation and tighter imperial control. “Organic work” sought strength through schools, cooperatives, business and civic associations. In practice many people combined the two traditions rather than choosing one forever.

Peasant emancipation weakened noble control and made the inclusion of peasants essential to any mass national movement. Industrial cities such as Łódź created new working classes and fortunes, while migration moved millions across empires and oceans. Socialists, nationalists, conservatives, feminists and religious activists offered competing answers to inequality and belonging. The revolution of 1905 in Russian Poland made these conflicts visible in strikes, street fighting and demands for schools and rights.

Plans to restore the old Commonwealth encountered peoples developing distinct modern identities and political claims. Lithuanian, Ukrainian, Belarusian and Jewish movements did not simply wait to join a Polish project; they developed languages, institutions and territorial visions of their own. Any future state would have to negotiate these claims or try to dominate them.

Culture reveals dimensions that a list of uprisings cannot. Chopin’s cosmopolitan music, Mickiewicz’s exile poetry, Matejko’s history painting and novels about industrial capitalism shaped lived experience and national imagination. Eliza Orzeszkowa’s novel Marta, for example, connected a widow’s struggle for survival to gendered limits on education and paid work. Such works carried memory and social criticism across censorship and borders, but they also elevated some stories over others. The nineteenth century therefore made “the nation” more socially broad and emotionally powerful while making agreement about its boundaries more difficult.`,
    },
    coverage: [
      { section: 'From noble insurrection to mass politics', evidence: 'repeated armed revolt, or long-term social, educational and economic organization' },
      { section: 'From noble insurrection to mass politics', evidence: 'inclusion of peasants essential to any mass national movement' },
      { section: 'From noble insurrection to mass politics', evidence: 'distinct modern identities and political claims' },
      { section: 'From noble insurrection to mass politics', evidence: 'gendered limits on education and paid work' },
    ],
    media: [
      commons('ostroleka', 'image', 'Battle painting and the romance of insurrection', 'Bitwa pod Ostroleka.jpg', 'A battle image can make uprising appear unified and heroic. Set that emotional power beside evidence about divided strategy, civilian costs, repression and exile.', 'Nineteenth-century battle painting of mounted and infantry forces at Ostrołęka.'),
      commons('chopin-polonaise', 'audio', 'Chopin’s Polonaise in A major', 'Chopin - Polonaise op. 40 no 1.ogg', 'The polonaise carried an elite dance form into concert culture. Its forceful rhythm, contrasts and returns help explain why later audiences heard dignity, memory and political feeling in instrumental music without literal words.', 'Audio performance of Frédéric Chopin’s Polonaise in A major, Opus 40 number 1.', 'CC0', 'Musopen performance; Commons source record', {
        mediaLabel: 'Listen · modern performance',
        textAlternative: 'This is a modern solo-piano interpretation, not a nineteenth-century recording. It opens with forceful chords and a strongly accented polonaise rhythm, moves through contrasting quieter and more martial passages, and repeatedly returns to its commanding main idea. There is no speech. The listening point is how rhythm, repetition and dynamic contrast can invite associations with ceremony, resolve and memory even though the composition does not narrate a political event.',
      }),
    ],
  },
  'war-and-independence': {
    deepDive: {
      kind: 'interpretation',
      title: 'Independence emerged from collapse and conflict',
      body: `Polish soldiers fought on opposing sides during the First World War because Polish lands were divided among empires whose armies fought one another. Civilians faced occupation, requisition, displacement and destroyed infrastructure. Activists could not know which empire would collapse, so they pursued rival strategies: Piłsudski built armed formations and imagined a federation in the east; Dmowski sought Entente support for a more centralized nation-state; socialists, conservatives and local councils prepared institutions on the ground.

11 November 1918 is a useful symbol, not a single moment of creation. Authority passed through local committees, soldiers’ councils, the Regency Council and Piłsudski’s new government while diplomats sought recognition abroad. Borders remained unsettled. Fighting with Ukrainians over Eastern Galicia, uprisings and plebiscites in the west, conflict with Czechoslovakia and war with Soviet Russia made independence a longer process of institutional transfer, diplomacy and border wars.

Self-determination was difficult to apply because populations were intermingled, historical borders overlapped and groups claimed the same cities and regions. A map could not make every village part of the preferred state of all its inhabitants. Piłsudski’s federation and Dmowski’s centralized model were different responses to that problem, not merely a personal rivalry.

The 1920 Battle of Warsaw became a powerful story of miraculous rescue. Military planning, intelligence, logistics, Soviet mistakes and popular mobilization are more useful explanations than miracle alone. The victory protected the new state, but the peace did not resolve minority politics or competing memories of the borderlands. Independence was real and extraordinary; it was also created amid violence whose consequences entered the Second Republic.`,
    },
    coverage: [
      { section: 'Independence emerged from collapse and conflict', evidence: 'lands were divided among empires whose armies fought one another' },
      { section: 'Independence emerged from collapse and conflict', evidence: 'useful symbol, not a single moment of creation' },
      { section: 'Independence emerged from collapse and conflict', evidence: 'federation in the east' },
      { section: 'Independence emerged from collapse and conflict', evidence: 'populations were intermingled, historical borders overlapped' },
    ],
    media: [
      commons('pilsudski-portrait', 'image', 'Piłsudski before the imperial collapse', 'Józef Piłsudski, 1916.jpg', 'The portrait shows a political-military leader before independence was assured. Avoid reading later success backward: his federal strategy competed with other Polish and non-Polish projects.', 'Black-and-white 1916 portrait of Józef Piłsudski in military uniform.'),
      commons('border-map-1921', 'map', 'Territorial change and contested borders', 'Territorial changes of Poland 1921.jpg', 'This map summarizes warfare, plebiscites and settlements after 1918. Treat its clean lines as outcomes of conflict, not as self-evident national borders.', 'Map showing territorial changes and borders of Poland around 1921.'),
    ],
  },
  'second-republic': {
    deepDive: {
      kind: 'interpretation',
      title: 'Modernization without a settled political community',
      body: `The Second Republic had to combine territories governed for generations by three different empires. Rail gauges, laws, currencies, bureaucracies and school systems did not fit together automatically. War damage and inflation made integration harder, yet the state created national institutions, a common currency and major infrastructure. Gdynia’s rapid growth symbolized the ambition to build an independent maritime economy.

Political inclusion remained unsettled. Roughly one-third of citizens belonged to minorities with distinct languages, religions and political goals. Ukrainians, Jews, Belarusians, Germans and others built parties, schools, associations and cultural movements. Constitutional equality existed alongside discrimination, administrative coercion and outbreaks of violence. Describing interwar Poland as ethnically homogeneous erases both the republic’s diversity and the conflicts its institutions failed to resolve.

The May Coup of 1926 grew from frustration with parliamentary instability but replaced electoral competition with an increasingly authoritarian Sanacja system. Opposition and some institutions survived, yet censorship, administrative pressure, manipulated elections and the detention of opponents narrowed fair democratic competition. The regime was neither a totalitarian dictatorship nor a healthy parliamentary democracy.

Modern expertise could flourish within these tensions. Polish mathematicians Marian Rejewski, Jerzy Różycki and Henryk Zygalski broke crucial versions of the Enigma cipher before the Second World War and shared their methods with British and French allies in 1939. Their achievement demonstrates that scientific intelligence was collaborative and began before Bletchley Park. The republic’s history is therefore best held together as achievement and exclusion: rapid institution-building and creativity occurred alongside authoritarianism, poverty and unresolved minority relations.`,
    },
    coverage: [
      { section: 'Modernization without a settled political community', evidence: 'three different empires' },
      { section: 'Modernization without a settled political community', evidence: 'increasingly authoritarian Sanacja system' },
      { section: 'Modernization without a settled political community', evidence: 'Roughly one-third of citizens belonged to minorities' },
      { section: 'Modernization without a settled political community', evidence: 'scientific intelligence was collaborative and began before Bletchley Park' },
    ],
    media: [
      commons('gdynia', 'image', 'Gdynia and the performance of modernity', 'Gdynia, Komisarjat Rzadu 1930-1939 (39491858).jpg', 'The new port city represented administrative ambition, maritime access and modern architecture. Ask what this carefully framed architectural photograph reveals—and what rural poverty or minority conflict it leaves outside the frame.', 'Black-and-white interwar photograph of the modern government administration building in Gdynia.'),
      commons('rejewski', 'image', 'Marian Rejewski and collaborative intelligence', 'Marian Rejewski 1932 small.jpg', 'Rejewski’s portrait personalizes a mathematical achievement built by a Polish team and later shared with allies. It challenges stories that begin Enigma codebreaking only in wartime Britain.', 'Black-and-white portrait of mathematician and cryptanalyst Marian Rejewski in 1932.', 'CC BY-SA 2.5', 'Unknown photographer; Rejewski family archive'),
    ],
  },
  'world-war-two': {
    deepDive: {
      kind: 'interpretation',
      title: 'Occupation created different dangers, choices and memories',
      body: `Poland was invaded by Nazi Germany and the Soviet Union in September 1939; there was no collaborating Polish state government. Nazi Germany designed and operated killing centres in occupied Poland, so geographic location does not imply Polish state responsibility. German occupation pursued racial transformation through terror, forced labour, expulsions and murder. Soviet occupation deported civilians, suppressed institutions and included the Katyń massacres of Polish officers and officials.

The Holocaust targeted Jews for total destruction. Ghettos, deportations and killing centres formed a German system implemented by occupying authorities and their auxiliaries. Individual behaviour around persecuted Jews must be studied through specific evidence recognizing rescue, indifference, coercion, blackmail and collaboration rather than a single national stereotype. German terror made aid dangerous; antisemitism and material incentives also shaped choices. Neither collective guilt nor blanket innocence explains local history.

Two Warsaw uprisings must remain distinct. The 1943 Warsaw Ghetto Uprising was Jewish resistance within the ghetto against deportation and annihilation. The 1944 Warsaw Uprising was led mainly by the Home Army across the city as Soviet forces approached. Both were fought against German occupation, but their organizations, immediate aims and historical situations differed.

Poland’s exile government expected restored sovereignty and pre-war eastern borders. Instead, the Red Army occupied the region and the Allied great powers accepted Soviet strategic dominance. Borders shifted west and a Soviet-backed government took power. Wartime decisions therefore cannot be separated from the asymmetry between a stateless underground, genocidal occupation and great powers deciding Europe’s post-war order. Sources—including perpetrator photographs—must be contextualized so that documentation does not reproduce the perpetrators’ viewpoint as spectacle.`,
    },
    coverage: [
      { section: 'Occupation created different dangers, choices and memories', evidence: 'Nazi Germany designed and operated killing centres in occupied Poland' },
      { section: 'Occupation created different dangers, choices and memories', evidence: '1943 Warsaw Ghetto Uprising was Jewish resistance' },
      { section: 'Occupation created different dangers, choices and memories', evidence: 'rescue, indifference, coercion, blackmail and collaboration' },
      { section: 'Occupation created different dangers, choices and memories', evidence: 'Allied great powers accepted Soviet strategic dominance' },
    ],
    media: [
      commons('stroop-source', 'image', 'A perpetrator-produced photograph as evidence', 'Stroop Collection - Warsaw Ghetto Uprising - Ghetto - 02.jpg', 'German forces made the Stroop Report to celebrate suppression of the 1943 uprising. This frame looks from the so-called “Aryan” side across the ghetto wall toward a burning factory. Study it as evidence of destruction and perpetrator self-presentation, not as a neutral view.', 'Black-and-white perpetrator photograph from the Stroop Report showing a factory burning behind the Warsaw Ghetto wall, viewed from the non-ghetto side.'),
      commons('nara-film', 'video', 'Liberation footage entered into evidence', 'Nazi Concentration Camps.webm', 'This 1945 US government documentary assembled Allied footage from concentration camps in Germany and Belgium, Mauthausen in Austria, and Hadamar, a Nazi “euthanasia” killing facility in Germany, for the Nuremberg trials. It does not show the German killing centres in occupied Poland; these institutions and camp categories must not be conflated. Content warning: disturbing images of camps, bodies and survivors; playback never starts automatically.', 'Public-domain 1945 documentary containing disturbing Allied footage from concentration camps in Germany and Belgium, Mauthausen concentration camp in Austria, and Hadamar, a Nazi “euthanasia” killing facility in Germany. These sites are distinct from German killing centres in occupied Poland.', 'Public domain', 'US government / National Archives', {
        mediaLabel: 'Watch · historical evidence film',
        textAlternative: 'The narrated film moves among concentration camps in Germany and Belgium, Mauthausen in Austria, and Hadamar, a Nazi “euthanasia” killing facility in Germany. It shows camp entrances and barracks, severely weakened survivors, piles of bodies, burial work and officials or local residents confronted with evidence. The editing and formal narration organize these graphic scenes as proof for a war-crimes court. The institutions shown differ from the German killing centres built in occupied Poland; the chapter text explains that distinction.',
      }),
    ],
  },
  'stalinism-peoples-poland': {
    deepDive: {
      kind: 'interpretation',
      title: 'A transformed society under constrained sovereignty',
      body: `Post-war Poland was geographically and demographically remade. It lost eastern territories to the Soviet Union and gained former German lands in the west and north. Genocide, flight, expulsion and forced resettlement made the country far more ethnically homogeneous. These processes were not one interchangeable migration: Jewish communities had been destroyed through genocide; Germans fled and were expelled; Poles and Ukrainians were forced across new borders under different authorities and conditions.

A Soviet-backed party-state eliminated independent political competition through manipulated elections, police violence and show trials. Stalinist rule was a dictatorship, yet its social history cannot be reduced to fear alone. Communist industrialization offered education, urban jobs and social mobility to some citizens while also imposing coercion, shortages and harsh labour discipline. People could benefit from one policy, resent another and adapt without endorsing the regime as a whole.

In 1956 worker protest in Poznań and conflict inside the party brought Gomułka to power. The harshest Stalinist practices eased and Poland gained limited room within the Soviet bloc, but one-party rule continued. Periodic bargaining over farms, church life and culture distinguished Poland from some neighbours without making it sovereign or democratic.

Nowa Huta captures these contradictions. Planned as a showcase socialist industrial city, it embodied steel, migration and the promise of a new working class. Residents then fought for a church, and its workers later joined opposition. The same place could represent state modernization, environmental and social costs, religious conflict and worker resistance. That layered meaning is more useful than treating every institution as either pure propaganda or pure opposition.`,
    },
    coverage: [
      { section: 'A transformed society under constrained sovereignty', evidence: 'far more ethnically homogeneous' },
      { section: 'A transformed society under constrained sovereignty', evidence: 'education, urban jobs and social mobility' },
      { section: 'A transformed society under constrained sovereignty', evidence: 'harshest Stalinist practices eased' },
      { section: 'A transformed society under constrained sovereignty', evidence: 'showcase socialist industrial city' },
    ],
    media: [
      commons('new-border', 'image', 'Marking the new western border in 1945', 'Marking Polish-German Border in 1945.jpg', 'A border-post photograph turns a great-power territorial decision into a visible fact on the ground. The new line accompanied flight, expulsion, resettlement and the difficult incorporation of former German regions.', 'Black-and-white photograph of Polish soldiers marking the new Polish-German border beside the Oder in 1945.'),
      commons('nowa-huta', 'image', 'Nowa Huta’s monumental administrative centre', 'CENTRUM ADMINISTRACYJNE MITTAL STEEL POLAND ODDZIAŁ W KRAKOWIE, fot. M. Klag (MIK, 2005) (3531291059).jpg', 'The planned ensemble shows how architecture staged order and industrial confidence. Its later history—as heritage, workplace and opposition landscape—complicates the original socialist-realist message.', 'Photograph of the monumental socialist-realist administrative buildings at the Nowa Huta steelworks.', 'CC BY-SA 2.0', 'Maciej Klag / Małopolska Institute of Culture')
    ],
  },
  'protest-solidarity': {
    deepDive: {
      kind: 'interpretation',
      title: 'How separate protests became a civic movement',
      body: `The road to Solidarity was not a simple rise of one heroic organization. In March 1968 the state repressed students and used antisemitic “anti-Zionist” rhetoric to purge institutions and force emigration, devastating the remaining Jewish community. In December 1970 security forces shot workers protesting price rises on the Baltic coast. Later opposition groups learned to connect intellectual, worker, religious and legal networks rather than allowing the regime to isolate them.

The election of John Paul II and his 1979 visit expanded a language of dignity and public assembly outside party control. When strikes spread in 1980, activists demanded more than wages. Solidarity’s mass membership and broad networks made it a forum for civic, political and moral demands across society. Ten million members did not hold one ideology; the movement included workers, experts, Catholics, secular dissidents and local activists linked by insistence on independent organization.

Jaruzelski imposed martial law in December 1981, interned activists and broke open organization. His claim that this was a “lesser evil” preventing Soviet intervention remains contested and requires evidence about Soviet intentions as well as the regime’s own interest in preserving power. Underground print, foreign broadcasting, church spaces and informal networks kept opposition alive, but repression changed lives and strategies.

By 1989, economic crisis, resilient opposition, changing Soviet policy and mutual uncertainty made compromise less risky than continued deadlock. Round Table negotiation was not a gift from rulers or a complete opposition victory. Each side accepted risk because it could not confidently impose its preferred future. This explains how a labour conflict became a civic movement and then one participant in negotiated systemic change.`,
    },
    coverage: [
      { section: 'How separate protests became a civic movement', evidence: 'antisemitic “anti-Zionist” rhetoric' },
      { section: 'How separate protests became a civic movement', evidence: 'forum for civic, political and moral demands' },
      { section: 'How separate protests became a civic movement', evidence: 'requires evidence about Soviet intentions' },
      { section: 'How separate protests became a civic movement', evidence: 'economic crisis, resilient opposition, changing Soviet policy and mutual uncertainty' },
    ],
    media: [
      commons('shipyard-gate', 'image', 'The Gdańsk Shipyard gate during the August strike', 'Solidarity August 1980 gate of Gdańsk Shipyard.jpg', 'Religious images, flowers, handwritten notices and crowds turned an industrial gate into a public forum. Look for the many social languages gathered around a workers’ strike.', 'Colour photograph of the Gdańsk Shipyard gate decorated with flowers, portraits and Solidarity strike notices in August 1980.'),
      commons('shipyard-strike', 'image', 'Support gathered at Gate No. 2', 'Strajk sierpniowy w Stoczni Gdańskiej im. Lenina 04.jpg', 'Decorations at Gate No. 2 and Gdańsk residents supporting the strikers show how an industrial dispute became a public civic event. Compare this street-facing solidarity with the symbols concentrated on the gate itself.', 'Documentary photograph of decorated Gate No. 2 at the Gdańsk Lenin Shipyard, with city residents supporting the strikers in August 1980.', 'CC BY-SA 3.0 pl', 'Zygmunt Błażek / European Solidarity Centre'),
    ],
  },
  'third-republic': {
    deepDive: {
      kind: 'interpretation',
      title: 'Democratic success did not end historical argument',
      body: `1989 is often called a negotiated revolution because institutions changed fundamentally through bargaining, elections and later reform rather than a single violent overthrow. The Round Table initially reserved power for the communist establishment, but opposition victories accelerated change beyond the settlement’s cautious design. A democratic constitution, competitive parties, local government and civic organizations developed over the following years rather than appearing fully formed on election night.

Rapid market reform stabilized inflation, expanded private enterprise and helped modernize the economy. It also imposed unemployment, insecurity and unequal regional costs. Long-run national growth did not make every factory closure or household loss imaginary. The geography of winners and losers shaped later distrust and political competition.

Poland joined NATO in 1999 and the European Union in 2004. Membership expanded mobility, investment and shared regulation while generating real debates over sovereignty and standards. These institutions constrain governments because members choose common rules; conflict over those rules is part of membership, not proof that membership has no value. Russia’s full-scale invasion of Ukraine in 2022 reinforced security concerns, while refugee reception and military support made Poland a central regional actor.

Historical analogy can highlight risks, but different institutions, actors and conditions make exact repetition unlikely. Memories of partitions, occupation and Soviet dominance influence threat perception; they should prompt questions rather than replace present evidence. The politics of museums, monuments, judicial reform and minority belonging shows that democracy does not settle memory once and for all. The Third Republic’s strongest interpretation combines measurable transformation with open conflict over who benefited, which institutions deserve trust and what kind of European Poland should become.`,
    },
    coverage: [
      { section: 'Democratic success did not end historical argument', evidence: 'institutions changed fundamentally through bargaining, elections and later reform' },
      { section: 'Democratic success did not end historical argument', evidence: 'unemployment, insecurity and unequal regional costs' },
      { section: 'Democratic success did not end historical argument', evidence: 'mobility, investment and shared regulation' },
      { section: 'Democratic success did not end historical argument', evidence: 'different institutions, actors and conditions make exact repetition unlikely' },
    ],
    media: [
      commons('eu-enlargement-map', 'map', 'Poland in the 2004 European Union enlargement', 'EU25-2004 European Union map enlargement.svg', 'The enlargement map shows institutional geography rather than cultural destiny. Membership connected Poland to shared law and markets while leaving national democratic conflict active.', 'Map highlighting the ten states, including Poland, that joined the European Union in 2004.', 'CC BY-SA 2.5', 'Júlio Reis; derivative map by Kolja21'),
      commons('nato-poland-video', 'video', 'A NATO transfer-of-authority ceremony in Poland', 'NATO Multinational Battle Group Poland Holds Transfer of Authority Ceremony (951607).webm', 'US military footage from 29 January 2025 documents one visible expression of NATO integration. Read the transfer-of-authority ceremony as institutional self-presentation as well as evidence of multinational presence. This modern alliance ritual is not a replay of 1939 or the Cold War.', 'Public-domain US military video showing a NATO multinational battle group transfer-of-authority ceremony in Poland on 29 January 2025.', 'Public domain', 'US Army / DVIDS', {
        mediaLabel: 'Watch · institutional self-presentation',
        textAlternative: 'The video records a formal military transfer-of-authority ceremony in Poland. Soldiers stand in formation with national and NATO symbols while officers mark a change of command through speeches and ritual handover. The images demonstrate a multinational military presence; the ceremony also presents the alliance in the orderly, cohesive terms preferred by its own institution. No quiz answer depends on hearing the speeches, and the chapter uses the scene to examine NATO membership rather than to treat military public relations as neutral documentation.',
      }),
    ],
  },
};
