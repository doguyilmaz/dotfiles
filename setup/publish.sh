#!/bin/bash
# Publishes the npm package with NPM_README.md instead of the repo README.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

cp "$REPO_ROOT/README.md" "$REPO_ROOT/README.md.bak"
cp "$REPO_ROOT/NPM_README.md" "$REPO_ROOT/README.md"

cd "$REPO_ROOT" && bun publish --access public "$@"

mv "$REPO_ROOT/README.md.bak" "$REPO_ROOT/README.md"
