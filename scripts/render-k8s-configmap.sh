#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$ROOT/k8s/generated"
if [ ! -d "$ROOT/dist-k8s" ]; then
  echo "dist-k8s/ not found; run npm run build first" >&2
  exit 1
fi
kubectl -n polish-history-quest create configmap polish-history-site \
  --from-file="$ROOT/dist-k8s" \
  --dry-run=client -o yaml > "$ROOT/k8s/generated/site-configmap.yaml"
