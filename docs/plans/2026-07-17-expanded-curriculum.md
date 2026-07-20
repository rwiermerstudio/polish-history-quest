# Expanded Polish History Curriculum Implementation Plan

> **For Hermes:** Implement task-by-task with strict RED–GREEN–REFACTOR verification.

**Goal:** Expand Polish History Quest from a six-card survey into a substantial English-language curriculum roughly comparable in scope to a Polish secondary-school overview, while keeping it approachable and interactive for educated adults.

**Architecture:** Move historical curriculum into a dedicated ES module with structured chapters, sections, actors, cultural artifacts, international context, timeline events and multi-question quizzes. Refactor the modal reader into a chapter learning workspace with navigable sections and cumulative quiz state. Preserve a fully static build and backward-compatible browser progress migration.

**Tech Stack:** Vanilla JavaScript ES modules, Vite, CSS, Node-based content verification, localStorage, GitHub Pages.

---

## Acceptance criteria

- At least 12 chronological chapters, beginning before 966 and extending through contemporary democratic Poland.
- At least 40 substantial curriculum sections in total.
- Every chapter includes context, major actors, events/causation, international context, and at least one cultural artifact or memory reference.
- At least four nuanced multiple-choice questions per chapter, each with answer-specific feedback/explanation.
- Quiz completion requires answering all chapter questions; progress is retained in `localStorage`.
- Timeline contains at least 35 events and distinguishes the Warsaw Ghetto Uprising (1943) from the Warsaw Uprising (1944).
- The reader remains usable on mobile and desktop, keyboard-accessible, and static.
- `bun run test`, `bun run build`, browser interaction checks, GitHub Actions and the live GitHub Pages smoke check all pass.

## Task 1: Add curriculum contract tests (RED)

**Files:**
- Modify: `scripts/verify-content.mjs`
- Create: `scripts/verify-curriculum.mjs`

1. Add tests that import curriculum data and require chapter/section/question/timeline counts.
2. Check unique IDs, chronological coverage, answer bounds and feedback on each option.
3. Check required themes and historical distinctions.
4. Run `bun run test`; confirm failure because `src/curriculum.js` and the new contract do not yet exist.

## Task 2: Create structured curriculum data (GREEN)

**Files:**
- Create: `src/curriculum.js`
- Modify: `package.json`

1. Define 13 chronological chapters.
2. Add concise but substantial sections for context, actors, causation, international setting, society and cultural memory.
3. Add four nuanced questions per chapter with explanations.
4. Expand timeline and memory-pair data.
5. Run the curriculum contract and correct all failures.

## Task 3: Refactor chapter reader and quiz state

**Files:**
- Modify: `src/main.js`
- Modify: `src/styles.css`
- Modify: `scripts/verify-content.mjs`

1. Import curriculum data instead of inline survey records.
2. Render chapter sections, actor cards, cultural artifact callouts and international-context blocks.
3. Implement next/previous section navigation and per-question quiz navigation.
4. Require all questions answered before marking a chapter complete.
5. Migrate existing v1 progress without losing completion data.
6. Add accessible labels, focus behavior and responsive styles.

## Task 4: Update documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/IMPLEMENTATION_PLAN.md`
- Create: `docs/CURRICULUM.md`

Document curriculum scope, historical editorial principles, chapter list, learning outcomes, source/further-reading strategy and known limitations. Avoid claiming equivalence to an accredited Polish school course; describe it as comparable survey scope.

## Task 5: Verify, review and release

1. Run `bun run test` and `bun run build`.
2. Run the app locally and test chapter navigation, multiple quiz answers and persisted progress.
3. Run a focused secret scan excluding generated dependencies.
4. Commit changes, push branch and open a PR.
5. Watch GitHub Actions to success.
6. Merge the PR and verify the GitHub Pages deployment.
7. Refresh artifact indexes/readmes.

## Risks and mitigations

- **Curriculum breadth vs readability:** use layered sections and concise cards rather than a single essay.
- **Historical controversy:** distinguish established facts from interpretation; avoid nationalist teleology and explain contested memories.
- **Content accuracy:** use cautious formulations, cross-check dates and preserve international context.
- **LocalStorage schema changes:** use additive defaults and tolerate old v1 data.
