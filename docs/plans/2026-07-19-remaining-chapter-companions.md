# Remaining Chapter Companions Implementation Plan

> **For Hermes:** Build Chapters 2–13 sequentially. Each chapter is a separate reviewed, tested, merged, published, and live-verified release.

**Goal:** Give every remaining Polish History Quest chapter a source-led, print-ready companion matching Chapter 1’s editorial and visual standard.

**Architecture:** Keep the main application structure unchanged. Add optional companion metadata chapter by chapter and publish standalone `public/chapter-N-companion.html` readers using the shared `public/history-companion.css`. Ordinary Vite output serves GitHub Pages; Kubernetes receives one base ConfigMap plus one small ConfigMap per companion through a projected volume, avoiding the 1 MiB object limit.

**Technology:** Semantic static HTML/CSS, existing Vite application, Node verification scripts, Wikimedia Commons open media, WeasyPrint A4 checks, GitHub Actions/Pages, nginx on k3s.

## Per-chapter release loop

For each chapter, in chronological order:

1. Create `feat/chapter-N-companion` from current `main`.
2. Research primary-source witnesses, modern historiography, and 10–12 candidate Commons records independently.
3. Add the chapter’s optional companion metadata and a failing existence/contract check.
4. Author a 7,500–11,000-word standalone reader with approximately 20 numbered sections, at least eight original-language/translated excerpts, ten figures including two maps, six competing-interpretation boxes, source notes, and at least 25 bibliography entries.
5. Verify every displayed original against one named edition/facsimile, including exact spelling, apparatus choices, page/column, chapter concordance, transmission, and translation.
6. Batch-audit Commons filenames, creator/date/licence metadata, captions, and alt text.
7. Run tests, production build, HTML validation, link checks, secret scan, Kubernetes generation, and `git diff --check`.
8. Render deterministic A4 output with fixed-size image placeholders; accept 20–25 pages and inspect the cover plus representative interior pages.
9. Obtain independent historical/source and code/deployment reviews. Freeze the relevant tree and do not merge until both pass; convert confirmed findings into regression assertions.
10. Commit, push, open a PR, watch branch CI, merge, and watch post-merge CI plus Pages deployment.
11. Apply generated ConfigMaps server-side with forced field ownership, restart the nginx deployment because files use `subPath`/projected mounts, and verify both Pages and k3s companion URLs plus the chapter link.
12. Report the release and only then start the next chapter from the new `main`.

## Planned readers

| Chapter | Period | Core companion emphasis |
|---|---:|---|
| 2 | 1138–1385 | Fragmentation, settlement, urban law, Mongol campaigns, religious communities, reunification |
| 3 | 1385–1569 | Polish–Lithuanian union, Jagiellonian politics, war, parliament, Renaissance and plural identities |
| 4 | 1569–1648 | Commonwealth constitution, elections, religious plurality, serfdom, frontier and Cossack tensions |
| 5 | 1648–1795 | Uprising and war, demographic crisis, political paralysis, Enlightenment reform and partitions |
| 6 | 1772–1815 | Partition regimes, reform legacies, revolution, Napoleon, society and competing loyalties |
| 7 | 1815–1914 | Uprisings, imperial rule, industrialization, organic work, mass politics, migration and modern identities |
| 8 | 1914–1921 | World war, occupation, revolution, independence, borders and competing national projects |
| 9 | 1921–1939 | Parliamentary democracy, coup and authoritarianism, economy, minorities, culture and foreign policy |
| 10 | 1939–1945 | German and Soviet occupation, Holocaust, resistance, collaboration, displacement and total war |
| 11 | 1945–1970 | Border changes, forced migration, Stalinism, reconstruction, thaw and social transformation |
| 12 | 1968–1989 | Protest, crisis, opposition, Catholic Church, Solidarity, martial law and negotiated transition |
| 13 | 1989–present | Democracy, market transition, inequality, memory politics, NATO/EU and contested belonging |

## Shared completion criteria

- Main chapter/timeline/game/progress structure remains unchanged.
- Every companion uses portable relative URLs and the shared reader stylesheet.
- Evidence classes remain distinguishable without colour alone.
- Remote media are optional; text and navigation remain useful offline.
- Generated Kubernetes resources remain individually below object-size limits.
- No release is announced while an independent review is outstanding.
