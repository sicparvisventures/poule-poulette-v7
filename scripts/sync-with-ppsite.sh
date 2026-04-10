#!/usr/bin/env bash
# Mirror app sources between sibling folders ppsite/ and poule-poulette-v7/.
# Gebruik: ./scripts/sync-with-ppsite.sh to-v7 | to-ppsite
# Dit bestand staat in beide repo's (zelfde inhoud); .github/ in v7 blijft bij to-v7 behouden.
set -euo pipefail

MODE="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARENT_NAME="$(basename "$(cd "$SCRIPT_DIR/.." && pwd)")"

if [[ "$PARENT_NAME" == "ppsite" ]]; then
  PPSITE="$(cd "$SCRIPT_DIR/.." && pwd)"
  V7="$(cd "$PPSITE/../poule-poulette-v7" && pwd)"
else
  V7="$(cd "$SCRIPT_DIR/.." && pwd)"
  PPSITE="$(cd "$V7/../ppsite" && pwd)"
fi

if [[ ! -d "$PPSITE" ]] || [[ ! -d "$V7" ]]; then
  echo "sync-with-ppsite: verwacht naast elkaar: .../ppsite en .../poule-poulette-v7"
  echo "  PPSITE=$PPSITE"
  echo "  V7=$V7"
  exit 1
fi

EXCLUDES=(
  --exclude ".git/"
  --exclude "node_modules/"
  --exclude ".next/"
  --exclude "out/"
  --exclude ".env"
  --exclude ".env.*"
  --exclude ".cursorignore"
  --exclude ".vercel/"
  --exclude "*.tsbuildinfo"
  --exclude ".DS_Store"
)

if [[ "$MODE" == "to-v7" ]]; then
  rsync -a --delete "${EXCLUDES[@]}" --exclude ".github/" "$PPSITE/" "$V7/"
  echo "Synced ppsite → poule-poulette-v7 (.github/ in v7 ongemoeid gelaten)."
elif [[ "$MODE" == "to-ppsite" ]]; then
  rsync -a "${EXCLUDES[@]}" --exclude ".github/" "$V7/" "$PPSITE/"
  echo "Synced poule-poulette-v7 → ppsite (zonder --delete: lokale ppsite-only bestanden blijven)."
else
  echo "Usage: $0 to-v7 | to-ppsite"
  exit 1
fi
