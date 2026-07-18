# Implementation plan: Polish History Quest

## Product concept

**Polish History Quest** is a static browser learning game for adults who know European/world history in general but have little specific background in Polish history or society. It should feel like a guided interactive magazine: concise explanations, visual timelines, memory aids, quizzes, and light games.

## Learning outcomes

Learners should be able to:

1. Place major Polish historical periods in chronological order.
2. Explain why the Polish-Lithuanian Commonwealth matters in European history.
3. Recognize the partitions as a central trauma and political fact shaping modern Poland.
4. Distinguish the Second Republic, wartime occupation, communist period, Solidarity, and EU/NATO era.
5. Connect historical events with social themes: language, religion, borders, statehood, civic resistance, and memory.

## Audience assumptions

- Adults, generally educated.
- Comfortable with short English explanatory texts.
- Little specific knowledge of Polish history.
- Likely benefits from maps, analogies, and visual sequencing.

## Core mechanics implemented

- **Expanded curriculum path**: 13 chronological chapters from early state formation to contemporary democratic Poland, with 66 substantial contextual sections.
- **Contextual multimedia**: two curated public-domain/open-licence media records per chapter, with lazy loading, native audio/video controls, alt text, captions and source/licence links.
- **Quiz coverage contract**: every question names a reading section and exact evidence phrase that covers the assessed content.
- **Contextual learning**: each chapter includes causation, important actors, international setting, society/economy, and cultural artifacts or memory debates.
- **Multi-question quizzes**: four nuanced questions per chapter, explanatory feedback, retry support, and completion only after all answers are correct.
- **Interactive timeline**: 46 major events from 966 to 2022, filterable by chapter.
- **Timeline ordering game**: order eight historical turning points correctly.
- **Partition puzzle**: choose the three partitioning powers and learn the geopolitical pattern.
- **Memory cards**: match 18 concepts to meanings.
- **Progress persistence**: completed chapters, individual answers, score, achievements and streak state are saved in browser `localStorage`.
- **Reset/export**: learners can reset progress or copy a progress summary.

## Design direction

- Warm, editorial, Notion-like design: readable, high-contrast, low-friction.
- Polish historical palette: crimson/white accents, parchment/warm neutral surfaces, restrained navy for depth.
- Game layer: badges, cards, achievements, progress meter.

## Future roadmap

- Add optional audio narration using recorded files or Web Speech API.
- Add short embedded video explainers or public-domain map animations.
- Add a richer map interaction for shifting borders.
- Add spaced repetition mode.
- Add localization: German, Dutch, Polish.
- Add teacher/facilitator mode with discussion prompts.
