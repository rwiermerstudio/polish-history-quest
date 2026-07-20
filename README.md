# Polish History Quest

A static, browser-based interactive learning game for adults who are generally educated but have little specific knowledge of Polish history or society.

## Goals

- Teach a substantial chronology from early Slavic settlement and Piast state formation to contemporary democratic Poland.
- Give turning points causal, social, international and cultural context rather than presenting isolated trivia.
- Introduce important actors without reducing history to “great men.”
- Keep learning exploratory through chapter reading, nuanced quizzes, timeline visualization and retrieval games.
- Persist progress locally in the browser with `localStorage`.
- Deploy as a static site to any web host.

## Curriculum and mechanics

- **13 chapters** with 66 contextual sections, including a new “Making sense of the period” synthesis in every chapter.
- **26 contextual media records**—public-domain/open-licence images, maps, audio and video—with captions, alt text or audiovisual text alternatives, provenance and licence links.
- **Four in-depth companions**—separately linked, print-ready readers for Chapters 1–4, each with 21–22 numbered sections, 10 sourced visuals, eight translated primary-source excerpts, interpretive debates and grouped further reading.
- **52 nuanced questions** with explanatory feedback; four correct answers complete a chapter.
- **Explicit quiz-to-text links** showing learners where each answer is taught, backed by exact coverage checks.
- **46-event filterable timeline** plus three chapter-linked games: date-hidden chronology reconstruction, a five-turn Commonwealth strategy campaign, and evidence-based archive casefiles.
- **Persistent local progress** including answers, completion, score and achievements.
- See [`docs/CURRICULUM.md`](docs/CURRICULUM.md) for scope and editorial principles.

Media are loaded on demand from Wikimedia Commons so the static repository avoids bundling large image binaries, while chapter text, quizzes, games and companion prose remain available if remote media are blocked. Images/audio/video and their external source pages require network access.

## Live site

**GitHub Pages:** <https://rwiermerstudio.github.io/polish-history-quest/>

Pushes to `main` are tested, built and deployed to GitHub Pages by [`.github/workflows/pages.yml`](.github/workflows/pages.yml). The Vite build uses relative asset paths so it remains portable beneath the repository subpath.

## Local development

```bash
bun install
bun run dev
bun run test
bun run check:media
bun run build
```

## Content note

This is a broad educational survey, not an accredited school course or scholarly reference. It approximates the scope of a secondary-school overview but remains selective. Historical framing should receive specialist review before formal classroom adoption.
