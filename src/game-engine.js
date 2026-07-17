export function moveCard(items, from, to) {
  const next = [...items];
  if (from < 0 || from >= next.length || to < 0 || to >= next.length || from === to) return next;
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function evaluateChronicle(order, correctOrder) {
  const correctSlots = order.filter((id, index) => id === correctOrder[index]).length;
  const adjacentPairs = order.slice(0, -1).filter((id, index) => {
    const left = correctOrder.indexOf(id);
    const right = correctOrder.indexOf(order[index + 1]);
    return right === left + 1;
  }).length;
  return { correctSlots, adjacentPairs, perfect: correctSlots === correctOrder.length };
}

export function applyCouncilChoice(state, option) {
  return Object.fromEntries(Object.entries(state).map(([meter, value]) => [
    meter,
    Math.max(0, Math.min(100, value + (option.effects[meter] || 0))),
  ]));
}

export function createArchiveDisplay(casefile, caseIndex, random = Math.random) {
  const shuffled = values => {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  };
  const evidence = shuffled(casefile.evidence.map(item => item.id));
  if (evidence.slice(0, 3).every(id => casefile.correctEvidence.includes(id))) {
    const falseLeadIndex = evidence.findIndex((id, index) => index >= 3 && !casefile.correctEvidence.includes(id));
    [evidence[2], evidence[falseLeadIndex]] = [evidence[falseLeadIndex], evidence[2]];
  }
  const correctIndex = casefile.interpretations.findIndex(option => option.correct);
  const alternatives = shuffled(casefile.interpretations.map((_, index) => index).filter(index => index !== correctIndex));
  const interpretations = [...alternatives];
  interpretations.splice([1, 2, 0][caseIndex % 3], 0, correctIndex);
  return { evidence, interpretations };
}

export function evaluateArchiveCase(selectedEvidence, correctEvidence, interpretationCorrect) {
  const evidenceScore = selectedEvidence.filter(id => correctEvidence.includes(id)).length;
  const falseLeads = selectedEvidence.length - evidenceScore;
  return {
    evidenceScore,
    falseLeads,
    interpretationCorrect: Boolean(interpretationCorrect),
    passed: evidenceScore === correctEvidence.length && falseLeads === 0 && interpretationCorrect,
  };
}
