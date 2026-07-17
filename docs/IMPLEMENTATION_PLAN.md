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

- **Path of eras**: six chapters, each with a concise introductory text and key idea.
- **Interactive timeline**: major events from 966 to 2004, filterable by era.
- **Mini quizzes**: multiple-choice checks after each chapter.
- **Timeline ordering game**: order historical events correctly.
- **Partition puzzle**: choose the three partitioning powers and learn the geopolitical pattern.
- **Memory cards**: match concepts to meanings.
- **Progress persistence**: completed chapters, score, achievements and streak state are saved in browser `localStorage`.
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
