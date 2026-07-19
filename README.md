# Polish History Quest

A static, browser-based interactive learning game for adults who are generally educated but have little specific knowledge of Polish history or society.

## Goals

- Teach a substantial chronology from early Slavic settlement and Piast state formation to contemporary democratic Poland.
- Give turning points causal, social, international and cultural context rather than presenting isolated trivia.
- Introduce important actors without reducing history to “great men.”
- Keep learning exploratory through chapter reading, nuanced quizzes, timeline visualization and retrieval games.
- Persist progress locally in the browser with `localStorage`.
- Deploy as a static site to any web host or the local Kubernetes cluster.

## Curriculum and mechanics

- **13 chapters** with 66 contextual sections, including a new “Making sense of the period” synthesis in every chapter.
- **26 contextual media records**—public-domain/open-licence images, maps, audio and video—with captions, alt text or audiovisual text alternatives, provenance and licence links.
- **Three in-depth companions**—separately linked, print-ready readers for Chapters 1–3, each with 21–22 numbered sections, 10 sourced visuals, eight translated primary-source excerpts, interpretive debates and grouped further reading.
- **52 nuanced questions** with explanatory feedback; four correct answers complete a chapter.
- **Explicit quiz-to-text links** showing learners where each answer is taught, backed by exact coverage checks.
- **46-event filterable timeline** plus three chapter-linked games: date-hidden chronology reconstruction, a five-turn Commonwealth strategy campaign, and evidence-based archive casefiles.
- **Persistent local progress** including answers, completion, score and achievements.
- See [`docs/CURRICULUM.md`](docs/CURRICULUM.md) for scope and editorial principles.

Media are loaded on demand from Wikimedia Commons so the static repository avoids bundling large image binaries and each generated Kubernetes resource remains manageable. Chapter text, quizzes, games and companion prose remain available if remote media are blocked, but images/audio/video and their external source pages require network access.

## Live site

- **GitHub Pages:** <https://rwiermerstudio.github.io/polish-history-quest/>
- **Local k3s ingress:** <http://polish-history.k3s.local/>

Pushes to `main` are tested, built and deployed to GitHub Pages by [`.github/workflows/pages.yml`](.github/workflows/pages.yml). The Vite build uses relative asset paths so it remains portable beneath the repository subpath.

## Local development

```bash
npm install
npm run dev
npm test
npm run check:media
npm run build
```

## Kubernetes deployment

The deployment manifests live in `k8s/`. `npm run build` creates the normal Vite `dist/` plus an inlined `dist-k8s/index.html`; standalone companion readers and their shared stylesheet are copied alongside it. The generic generator discovers every `chapter-*-companion.html`, writes one base ConfigMap plus one ConfigMap per companion, and the deployment combines them through a projected volume (Chapter 3 and future slots are already declared). This keeps every Kubernetes object below the ConfigMap size limit as the companion library grows. After building, generate the resources and apply the manifests:

```bash
./scripts/render-k8s-configmap.sh
kubectl apply -f k8s/namespace.yaml
kubectl apply --server-side --force-conflicts -f k8s/generated/site-configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl -n polish-history-quest rollout restart deploy/polish-history-quest
kubectl -n polish-history-quest rollout status deploy/polish-history-quest --timeout=180s
```

The local k3s deployment uses Traefik host `polish-history.k3s.local`.

When upgrading an existing `0.5.x` deployment from the former direct `configMap` volume to the projected multi-ConfigMap volume, Kubernetes cannot change the volume-source union through server-side apply. Replace the Deployment once after applying the generated ConfigMaps:

```bash
kubectl replace -f k8s/deployment.yaml
kubectl -n polish-history-quest rollout status deploy/polish-history-quest --timeout=180s
```

Fresh installations and later companion-only releases can continue to use the normal apply-and-restart sequence above. Server-side apply avoids Kubernetes' 256 KiB client-side last-applied annotation limit for generated static-site resources. `--force-conflicts` lets the generated ConfigMaps take field ownership from older client-side or `replace` operations. Projected ConfigMap volumes update asynchronously through kubelet, so the rollout restart makes publication immediate and deterministic.

## Content note

This is a broad educational survey, not an accredited school course or scholarly reference. It approximates the scope of a secondary-school overview but remains selective. Historical framing should receive specialist review before formal classroom adoption.
