#!/bin/bash
# Collects AI tool configs and system info from any machine.
# Run on work Mac, then copy the output file back to compare.
#
# Usage: bash collect-machine-config.sh
# Output: ~/dotfiles-report-<hostname>.md

REPORT="$HOME/dotfiles-report-$(hostname -s).md"

{
  echo "# Machine Config Report"
  echo "- **Host:** $(hostname -s)"
  echo "- **OS:** $(uname -s) $(uname -m)"
  echo "- **Date:** $(date +%Y-%m-%d)"
  echo ""

  echo "## Claude Code"
  echo "### settings.json"
  echo '```json'
  cat ~/.claude/settings.json 2>/dev/null || echo "(not found)"
  echo '```'
  echo "### CLAUDE.md"
  echo '```markdown'
  cat ~/.claude/CLAUDE.md 2>/dev/null || echo "(not found)"
  echo '```'
  echo ""

  echo "## Cursor"
  echo "### mcp.json"
  echo '```json'
  cat ~/.cursor/mcp.json 2>/dev/null || echo "(not found)"
  echo '```'
  echo "### Skills"
  echo '```'
  ls ~/.cursor/skills/ 2>/dev/null || echo "(not found)"
  echo '```'
  echo ""

  echo "## Gemini CLI"
  echo "### settings.json"
  echo '```json'
  cat ~/.gemini/settings.json 2>/dev/null || echo "(not found)"
  echo '```'
  echo "### GEMINI.md"
  echo '```markdown'
  cat ~/.gemini/GEMINI.md 2>/dev/null || echo "(not found)"
  echo '```'
  echo "### Skills"
  echo '```'
  ls ~/.gemini/skills/ 2>/dev/null || echo "(not found)"
  echo '```'
  echo ""

  echo "## Windsurf"
  echo "### mcp_config.json"
  echo '```json'
  cat ~/.codeium/windsurf/mcp_config.json 2>/dev/null || echo "(not found)"
  echo '```'
  echo "### Skills"
  echo '```'
  ls ~/.codeium/windsurf/skills/ 2>/dev/null || echo "(not found)"
  echo '```'
  echo ""

  echo "## Shell"
  echo "### .zshrc"
  echo '```bash'
  cat ~/.zshrc 2>/dev/null || echo "(not found)"
  echo '```'
  echo ""

  echo "## Git"
  echo "### .gitconfig"
  echo '```ini'
  cat ~/.gitconfig 2>/dev/null || echo "(not found)"
  echo '```'
  echo ""

  echo "## Editors"
  echo "### Zed settings.json"
  echo '```json'
  cat ~/.config/zed/settings.json 2>/dev/null || echo "(not found)"
  echo '```'
  echo "### Cursor editor settings"
  echo '```json'
  cat ~/Library/Application\ Support/Cursor/User/settings.json 2>/dev/null || echo "(not found)"
  echo '```'
  echo ""

  echo "## Terminal"
  echo "### p10k theme"
  echo '```'
  [ -f ~/.p10k.zsh ] && echo "(exists, $(wc -l < ~/.p10k.zsh) lines)" || echo "(not found)"
  echo '```'
  echo ""

  echo "## Homebrew"
  echo '```'
  brew list --formula 2>/dev/null | sort || echo "(brew not found)"
  echo '```'
  echo "### Casks"
  echo '```'
  brew list --cask 2>/dev/null | sort || echo "(brew not found)"
  echo '```'

} > "$REPORT"

echo "Report saved to: $REPORT"
echo "Copy it back with: scp $(hostname -s):$REPORT ~/Developer/Personal/dotfiles/reports/"
