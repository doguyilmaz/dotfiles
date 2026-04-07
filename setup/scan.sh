#!/bin/bash
# Quick scan — check any file or directory for sensitive data
# Usage: bash setup/scan.sh [path]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

if ! command -v bun &>/dev/null; then
    echo "Bun is required. Install: https://bun.sh"
    exit 1
fi

cd "$REPO_ROOT" && bun bin/dotfiles.ts scan "$@"
