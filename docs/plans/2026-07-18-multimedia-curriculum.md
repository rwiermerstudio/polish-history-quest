# Multimedia curriculum enrichment plan

**Date:** 2026-07-18  
**Goal:** Make every chapter more explanatory and engaging while guaranteeing that learners encounter the knowledge assessed by all 52 quiz questions.

## Architecture

1. Keep the canonical 13-chapter survey and quiz data in `src/curriculum.js`.
2. Keep the enrichment layer in `src/chapter-extras.js`, keyed by stable chapter IDs:
   - one interpretive synthesis per chapter;
   - four quiz-to-reading coverage references;
   - two contextual media records per chapter.
3. Enrich exported chapters once at module initialization so games, timeline links and progress keys continue to use the existing chapter IDs.
4. Render remote media lazily with native browser controls and no autoplay.
5. Preserve provenance in the interface: title, contextual caption, descriptive alternative text, source page, licence and attribution.

## Content standards

- Explain causation, contingency, evidence and significance rather than merely adding dates.
- Do not project a modern nation-state backward onto dynastic or Commonwealth history.
- Include Polish-Lithuanian, Ukrainian, Belarusian, Jewish, German, minority and social-history contexts where relevant.
- Avoid collective guilt, blanket exoneration and teleological stories.
- Identify later paintings, reconstructed maps, propaganda and perpetrator-produced records as interpreted sources rather than transparent windows.
- Give sensitive audiovisual material a visible content warning and never autoplay it.

## Verification contracts

- At least five explanatory sections per chapter and an `interpretation` section in every chapter.
- At least 12,500 measured curriculum words.
- Every quiz question names a real section and an exact evidence phrase present in that section.
- Two complete media records per chapter; images, maps, audio and video represented globally.
- At least 18 of 26 media items are public domain or CC0; remaining items use explicit open licences and attribution.
- Wikimedia Commons API check confirms every file exists and the configured licence matches current source metadata.
- UI checks require lazy images, native audio/video controls, audiovisual text alternatives, provenance links, quiz coverage labels, a focus-contained/restoring modal, responsive media grids, visible focus and reduced-motion support.
- Build must remain relative-path safe and produce no host-specific artifacts.

## Release verification

1. Run `npm test`, `npm run check:media`, `npm run build`, dependency audit and whitespace checks.
2. Exercise all chapter media in a production build; verify image load, audio metadata, video metadata, no horizontal overflow and quiz coverage labels.
3. Obtain independent historical/content review and repair concrete blockers.
4. Merge only after feature and main CI pass.
5. Verify the GitHub Pages deployment and compare the live artifact with the local release.
