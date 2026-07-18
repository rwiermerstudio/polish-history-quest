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
- **52 nuanced questions** with explanatory feedback; four correct answers complete a chapter.
- **Explicit quiz-to-text links** showing learners where each answer is taught, backed by exact coverage checks.
- **46-event filterable timeline** plus three chapter-linked games: date-hidden chronology reconstruction, a five-turn Commonwealth strategy campaign, and evidence-based archive casefiles.
- **Persistent local progress** including answers, completion, score and achievements.
- See [`docs/CURRICULUM.md`](docs/CURRICULUM.md) for scope and editorial principles.

Media are loaded on demand from Wikimedia Commons so the static application and Kubernetes ConfigMap remain small. Chapter text, quizzes and games remain available if remote media are blocked, but images/audio/video and their external source pages require network access.

## Local development

```bash
npm install
npm run dev
npm test
npm run check:media
npm run build
```

## Kubernetes deployment

The deployment manifests live in `k8s/`. `npm run build` creates the normal Vite `dist/` plus a single-file `dist-k8s/index.html` bundle for ConfigMap-based Kubernetes serving. After building, generate the ConfigMap and apply the manifests:

```bash
./scripts/render-k8s-configmap.sh
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/generated/site-configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl -n polish-history-quest rollout status deploy/polish-history-quest --timeout=180s
```

The local k3s deployment uses Traefik host `polish-history.k3s.local`.

## Content note

This is a broad educational survey, not an accredited school course or scholarly reference. It approximates the scope of a secondary-school overview but remains selective. Historical framing should receive specialist review before formal classroom adoption.
