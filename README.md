# Polish History Quest

A static, browser-based interactive learning game for adults who are generally educated but have little specific knowledge of Polish history or society.

## Goals

- Teach the major arcs of Polish history without assuming prior knowledge.
- Keep the experience exploratory and game-like rather than textbook-like.
- Use short introductory texts, timeline visualization, mini quizzes, map/partition visualization, memory-style games, and achievement/progress tracking.
- Persist progress locally in the browser with `localStorage`.
- Deploy as a static site to any web host or the local Kubernetes cluster.

## Local development

```bash
npm install
npm run dev
npm test
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

This is an introductory educational game, not a scholarly reference work. Historical summaries are intentionally concise and should be reviewed by a domain expert before use in a formal course.
