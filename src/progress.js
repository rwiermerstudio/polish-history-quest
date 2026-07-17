export function normalizeProgress(stored, chapters, legacyProgressMap, defaults) {
  const safeStored = stored && typeof stored === 'object' ? stored : {};
  const currentIds = new Set(chapters.map(chapter => chapter.id));
  const answeredQuestions = Object.fromEntries(
    Object.entries(safeStored.answeredQuestions || {}).filter(([id, answers]) => currentIds.has(id) && answers && typeof answers === 'object'),
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

  return { ...defaults, ...safeStored, completed, achievements, answeredQuestions, legacyCompleted };
}
