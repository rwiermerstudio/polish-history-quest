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

export function evaluateArchiveCase(selectedEvidence, correctEvidence, interpretationCorrect) {
  const evidenceScore = selectedEvidence.filter(id => correctEvidence.includes(id)).length;
  const falseLeads = selectedEvidence.length - evidenceScore;
  return {
    evidenceScore,
    falseLeads,
    passed: evidenceScore === correctEvidence.length && falseLeads === 0 && interpretationCorrect,
  };
}
