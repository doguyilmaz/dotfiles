#!/bin/bash
# Quick backup — run from anywhere, no bun global install needed
# Usage: bash setup/backup.sh [--archive] [--only ai,shell] [--skip editor]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

if ! command -v bun &>/dev/null; then
    echo "Bun is required. Install: https://bun.sh"
    exit 1
fi

cd "$REPO_ROOT" && bun bin/dotfiles.ts backup "$@"
