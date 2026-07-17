export function normalizeProgress(stored, chapters, legacyProgressMap, defaults) {
  const safeStored = stored && typeof stored === 'object' ? stored : {};
  const currentIds = new Set(chapters.map(chapter => chapter.id));
  const chapterById = new Map(chapters.map(chapter => [chapter.id, chapter]));
  const answeredQuestions = Object.fromEntries(
    Object.entries(safeStored.answeredQuestions || {})
      .filter(([id, answers]) => currentIds.has(id) && answers && typeof answers === 'object')
      .map(([id, answers]) => [id, Object.fromEntries(
        Object.entries(answers)
          .filter(([index, answer]) => answer?.correct === true && chapterById.get(id).quiz[Number(index)])
          .map(([index]) => [index, { choice: chapterById.get(id).quiz[Number(index)].answer, correct: true }]),
      )])
      .filter(([, answers]) => Object.keys(answers).length > 0),
  );

  const completed = Object.fromEntries(
    chapters
      .filter(chapter => chapter.quiz.every((_, index) => answeredQuestions[chapter.id]?.[index]?.correct === true))
      .map(chapter => [chapter.id, true]),
  );

  const migratedLegacy = Object.entries(safeStored.completed || {})
    .filter(([id, value]) => value && legacyProgressMap[id] && !completed[legacyProgressMap[id]])
    .map(([id]) => legacyProgressMap[id]);
  const legacyCompleted = [...new Set([...(safeStored.legacyCompleted || []), ...migratedLegacy])]
    .filter(id => currentIds.has(id) && !completed[id]);
  const achievements = { ...(safeStored.achievements || {}) };
  if (legacyCompleted.length) achievements['legacy-learner'] = true;
  const trueFlags = value => Object.fromEntries(
    Object.entries(value && typeof value === 'object' ? value : {}).filter(([, won]) => won === true),
  );
  const gameProgress = {
    chronicleWins: trueFlags(safeStored.chronicleWins),
    councilWin: safeStored.councilWin === true,
    archiveWins: trueFlags(safeStored.archiveWins),
  };

  return { ...defaults, ...safeStored, ...gameProgress, completed, achievements, answeredQuestions, legacyCompleted };
}
