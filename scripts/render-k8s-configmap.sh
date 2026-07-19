#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/k8s/generated/site-configmap.yaml"
DIST="$ROOT/dist-k8s"
mkdir -p "$ROOT/k8s/generated"
if [ ! -d "$DIST" ]; then
  echo "dist-k8s/ not found; run npm run build first" >&2
  exit 1
fi
for file in index.html history-companion.css; do
  if [ ! -f "$DIST/$file" ]; then
    echo "$DIST/$file not found; run npm run build first" >&2
    exit 1
  fi
done

kubectl -n polish-history-quest create configmap polish-history-site \
  --from-file="$DIST/index.html" \
  --from-file="$DIST/history-companion.css" \
  --dry-run=client -o yaml > "$OUT"

mapfile -t companions < <(printf '%s\n' "$DIST"/chapter-*-companion.html | sort -V)
for path in "${companions[@]}"; do
  [ -f "$path" ] || continue
  file="$(basename "$path")"
  chapter="${file#chapter-}"
  chapter="${chapter%-companion.html}"
  {
    printf '%s\n' '---'
    kubectl -n polish-history-quest create configmap "polish-history-companion-$chapter" \
      --from-file="$path" \
      --dry-run=client -o yaml
  } >> "$OUT"
done

printf 'wrote %s with %d companion ConfigMaps\n' "$OUT" "${#companions[@]}"
cd "$ROOT"
node scripts/verify-k8s-configmaps.mjs
