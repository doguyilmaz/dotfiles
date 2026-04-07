#!/bin/bash
# Quick restore — run from anywhere, no bun global install needed
# Usage: bash setup/restore.sh <backup-path> [--pick] [--dry-run]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

if ! command -v bun &>/dev/null; then
    echo "Bun is required. Install: https://bun.sh"
    exit 1
fi

if [[ $# -eq 0 ]]; then
    echo "Usage: bash setup/restore.sh <backup-path> [--pick] [--dry-run]"
    exit 1
fi

cd "$REPO_ROOT" && bun bin/dotfiles.ts restore "$@"
