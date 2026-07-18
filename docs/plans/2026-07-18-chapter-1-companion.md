# Chapter 1 In-Depth Companion Implementation Plan

> **For Hermes:** Implement this plan with test-first contracts, source verification, independent historical review, and the existing PR/CI/deployment workflow.

**Goal:** Add an approximately twenty-A4-page, source-backed companion to Chapter 1 without changing the website’s main chapter/timeline/game structure.

**Architecture:** Keep the existing chapter modal and navigation intact. Add one optional `companion` metadata object to Chapter 1 and render a compact sidebar link through the existing chapter workspace. Publish a standalone, semantic, print-optimized HTML document at `chapter-1-companion.html`; Vite/GitHub Pages copy it from `public/`, while the inlined Kubernetes build copies the companion HTML/CSS into `dist-k8s/` so the same relative link works on both hosts.

**Tech stack:** Plain HTML/CSS, existing Vite build, Node verification scripts, Wikimedia Commons remote open media, GitHub Pages, Kubernetes ConfigMap.

---

## Scope and editorial requirements

- Cover c. 500–1138, with necessary context before 500 and an epilogue explaining the 1138 transition.
- Target roughly 8,000–10,000 words plus captions, excerpts, notes, bibliography and print front matter—approximately twenty A4 pages under the supplied print stylesheet.
- Distinguish archaeology from later narrative, dynasty from modern nation, conversion at court from slower Christianization, and contemporary evidence from later memory.
- Include original-language primary-source excerpts with new English translations, precise source references, interpretive cautions and stable links.
- Include at least two maps and six additional public-domain/open-licence illustrations, each with caption, alt text, creator, date, licence and source record.
- Present competing interpretations rather than a single certainty: ethnogenesis; pace/coercion of Piast state formation; baptism motives; `Dagome iudex`; Gniezno 1000; the 1030s crisis; church/state conflict; Gallus’s political programme.
- End with source notes and categorized further literature, separating accessible introductions, specialist studies and primary-source editions.

## Task 1: Companion contracts (RED)

**Modify:** `scripts/verify-curriculum.mjs`, `scripts/verify-learning-ui.mjs`, `scripts/verify-built-static.mjs`

Add initially failing assertions that:

- Chapter `lands-before-poland` has a companion title, description and relative `.html` path.
- The main renderer exposes the optional companion link.
- Built `dist/chapter-1-companion.html` and CSS exist.
- Companion HTML has semantic title/nav/main/sections, print CSS, at least 7,500 prose words, at least 8 figures including 2 maps, at least 6 source excerpts with original and translated text, source/licence links, interpretation/discussion sections, bibliography and accessible alt text.
- `dist-k8s/` contains the companion HTML/CSS and contains no unresolved `/assets/` path in the primary app.

Run `npm test` and confirm the new assertions fail because the companion does not exist.

## Task 2: Build/deployment path (GREEN)

**Modify:** `src/curriculum.js`, `src/main.js`, `src/styles.css`, `scripts/inline-dist.mjs`

- Add generic optional companion metadata to Chapter 1.
- Render one sidebar callout/link only when metadata exists.
- Copy the built companion HTML/CSS from `dist/` into `dist-k8s/` after the app bundle is inlined.
- Keep the existing modal, section tabs, quiz, games and progress behavior unchanged.

## Task 3: Author the standalone companion

**Create:** `public/chapter-1-companion.html`, `public/chapter-1-companion.css`

Use semantic HTML with:

1. Reader guide and chronology.
2. Landscapes, settlement and archaeological limits.
3. Slavic identities and the problem of ethnogenesis.
4. Greater Poland strongholds and coercive state formation.
5. Court, tribute, warfare, trade and enslavement.
6. Mieszko’s first appearances in written sources.
7. Baptism in 966 and competing explanations.
8. Dobrawa, women, households and conversion.
9. Church organization and uneven Christianization.
10. `Dagome iudex`, borders and papal relations.
11. Bolesław Chrobry, Adalbert and Gniezno 1000.
12. War, empire, Rus and royal coronation.
13. Crisis after 1025 and the 1030s breakdown.
14. Restoration, Kraków and a changing political centre.
15. Bolesław II, Bishop Stanisław and source conflict.
16. Bolesław III, Gallus and constructed dynastic memory.
17. Society, economy, material culture and religion from below.
18. What did—and did not—exist by 1138.
19. Source criticism workshop and competing models.
20. Notes, source editions and further reading.

Use a restrained print-oriented design, visible focus, responsive figures/tables, no JavaScript dependency, and no autoplay or decorative-only imagery.

## Task 4: Verify media and citations

- Query Commons API in one batch to verify final filenames, direct URLs, MIME/media type, licence and creator metadata.
- Inspect every visual against caption and alt text.
- Verify every quoted original passage against a public-domain transcription/edition; identify translations as newly prepared for this companion.
- Do not quote modern copyrighted translations.
- Add automated link/metadata checks where stable and use manual source comparison for semantic accuracy.

## Task 5: Browser, print and accessibility QA

- Run `npm test`, `npm run check:media`, `npm run build`, `git diff --check` and production dependency audit.
- Open the chapter modal and verify the companion callout appears only in Chapter 1.
- Follow the link at a nested static path; confirm navigation, images, source links, responsive layout, print rules and no console errors.
- Generate or inspect a print-to-PDF rendering when an available renderer permits; target roughly 18–24 A4 pages and report the actual count. If no renderer is available, verify the explicit print-page structure and state that limitation rather than inventing a count.
- Verify both ordinary `dist/` and `dist-k8s/` companion paths.

## Task 6: Independent review and release

- Dispatch a fail-closed historical/source/licensing/accessibility review.
- Repair each confirmed blocker with a regression test and rerun the reviewer against the frozen tree.
- Commit, push, open a PR, watch branch CI, merge, watch main CI and Pages deployment.
- Regenerate/apply the Kubernetes ConfigMap, restart the two-replica deployment, and verify both public GitHub Pages and k3s-served links.
