# dotfiles

Personal configuration files and custom AI skills synced across machines. Optimized for fast setup on new/replacement machines.

> **The big picture:** This repo syncs configs, but the real goal is a curated **superskill** — a single skill that encodes my preferred development workflow (web, mobile, animations, email, etc.) by composing the best community skills. One update here propagates to every AI tool on every machine via `skills.sh`.

## Machines

| Machine | OS | Shell | Primary Use |
|---|---|---|---|
| Home Mac | macOS | zsh (oh-my-zsh + p10k) | Primary dev machine |
| Work Mac | macOS | zsh (oh-my-zsh + p10k) | Dev — mostly synced with personal, few extras |
| Home Windows | Windows | — | Non-dev (Stable Diffusion, etc.) |

## Structure

```
dotfiles/
├── ai/                        # AI tools — first-class configs
│   ├── claude/
│   │   ├── CLAUDE.md          # Global Claude Code instructions/rules
│   │   └── settings.json     # Enabled plugins & preferences
│   ├── cursor/
│   │   ├── mcp.json           # MCP server configs
│   │   └── rules/             # Cursor rules (if any)
│   ├── gemini/
│   │   ├── GEMINI.md          # Gemini CLI rules/directives
│   │   └── settings.json     # Gemini preferences
│   ├── windsurf/
│   │   └── mcp_config.json   # MCP server configs
│   └── shared/
│       ├── ai-tools.md        # Full skills/plugins/MCP inventory (superskill blueprint)
│       └── mcp-servers.md     # Canonical MCP server list & setup notes
├── shell/
│   ├── .zshrc                 # Main zsh config (shared)
│   ├── aliases.zsh            # Shared aliases
│   └── exports.zsh            # Shared exports & PATH
├── git/
│   ├── .gitconfig             # Global git config
│   └── .gitignore_global      # Global gitignore
├── editor/
│   ├── cursor/
│   │   └── settings.json     # Cursor editor settings
│   ├── vscode/
│   │   └── settings.json     # VS Code editor settings
│   └── zed/
│       └── settings.json     # Zed editor settings
├── terminal/
│   └── .p10k.zsh             # Powerlevel10k theme config
├── skills/                        # Custom AI skills (the main event)
│   ├── superskill/
│   │   ├── skill.md               # The superskill — composable dev workflow
│   │   └── README.md              # What it does, which sub-skills, boundaries
│   ├── web-dev/                   # Web app development skill
│   │   └── skill.md
│   ├── mobile-dev/                # Mobile app development skill
│   │   └── skill.md
│   └── skills.sh                  # Installer — symlinks skills to all AI tools
├── apps/
│   ├── Brewfile               # Homebrew formulae & casks
│   └── apps.md                # Full app list with install sources
├── macos/
│   └── defaults.sh           # macOS system preferences
├── setup/
│   └── install.sh            # macOS installer
├── CLAUDE.md                  # Project-level Claude instructions
└── README.md
```

> **Note:** `ai/cursor/` holds MCP/rules configs (from `~/.cursor/`), while `editor/cursor/` holds editor settings (from `~/Library/Application Support/Cursor/`). Same tool, different config scopes.

## Collect Machine Config

Generate a report of all AI tools, skills, MCPs, shell, git, and editor configs on any machine. No clone needed.

```bash
bunx github:doguyilmaz/dotfiles
```

Or if the repo is already cloned:

```bash
bash ~/dotfiles/setup/collect-machine-config.sh
```

Report is saved to `reports/` (in repo) or `~/` (standalone).

## Quick Start

> TODO: Will be implemented in Phase 4

```bash
git clone https://github.com/doguyilmaz/dotfiles.git ~/dotfiles
cd ~/dotfiles
./setup/install.sh
```

## Roadmap

### Phase 1 — Organize & Sync Configs

Get all config files into the repo with a clean structure. AI configs are top priority.

**AI Tools:**
- [ ] Add Claude Code configs (`ai/claude/CLAUDE.md`, `ai/claude/settings.json`)
- [ ] Add Cursor MCP config (`ai/cursor/mcp.json`)
- [ ] Add Gemini CLI configs (`ai/gemini/GEMINI.md`, `ai/gemini/settings.json`)
- [ ] Add Windsurf MCP config (`ai/windsurf/mcp_config.json`)
- [ ] Create shared MCP servers reference (`ai/shared/mcp-servers.md`)

**Shell & Git:**
- [ ] Move `.zshrc` to `shell/.zshrc`
- [ ] Add `.gitconfig` and `.gitignore_global` to `git/`

**Editors & Terminal:**
- [ ] Add Zed settings to `editor/zed/`
- [ ] Add `.p10k.zsh` to `terminal/`

**Repo Hygiene:**
- [ ] Add `.gitignore` to exclude secrets, caches, API keys
- [ ] Update symlink reference in README

### Phase 2 — Clean Up & Cross-Machine Support

Make configs portable across machines and usernames.

- [ ] Replace hardcoded `/Users/dogukyilmaz/` with `$HOME` in all configs
- [ ] Remove duplicate blocks in `.zshrc` (bun, fnm are duplicated)
- [ ] Remove stale/placeholder paths (e.g. `~/path/to/zig`)
- [ ] Split `.zshrc` into shared + platform-specific files (source conditionally)
- [ ] Add OS detection for platform-specific blocks

### Phase 3 — Superskill (Core Vision)

A curated, composable skill that encodes the preferred dev workflow. Shared across all AI tools via `skills.sh`.

**Research & Design** (using `ai/shared/ai-tools.md` as blueprint)**:**
- [ ] Audit all currently installed skills across Claude, Cursor, Windsurf, Gemini
- [ ] Compare with work Mac report — merge skill inventories
- [ ] Categorize: which skills for web, mobile, animations, email, infra, etc.
- [ ] Define boundaries: when each skill applies, in what context, why
- [ ] Use `find-skills` to discover additional community skills worth including
- [ ] Map skill references (Software Mansion animations, Resend react-email, Vercel, Callstack RN, Expo)

**Build:**
- [ ] Design superskill structure (directives + sub-skill references)
- [ ] Create `skills/superskill/skill.md` — the main composable skill
- [ ] Create domain-specific sub-skills if needed (`web-dev/`, `mobile-dev/`)
- [ ] Create `skills/skills.sh` — installer that symlinks to `~/.claude/skills/`, `~/.cursor/skills/`, `~/.gemini/skills/`, `~/.codeium/windsurf/skills/`
- [ ] Test across Claude Code, Cursor, Windsurf, Gemini CLI
- [ ] Document skill boundaries and usage in `skills/superskill/README.md`

### Phase 4 — Installer Script

One command to set up a new machine. Critical for work Mac migrations.

- [ ] Create `setup/install.sh` for macOS
  - [ ] Detect OS and architecture
  - [ ] Backup existing configs before overwriting
  - [ ] Create all symlinks automatically (configs + skills)
  - [ ] Install Homebrew + Brewfile (formulae, casks, Mac App Store apps)
  - [ ] Install oh-my-zsh + plugins (zsh-autosuggestions, zsh-syntax-highlighting)
  - [ ] Install dev tools (bun, fnm, etc.)
- [ ] Create `apps/Brewfile` with all Homebrew dependencies
- [ ] Add uninstall/restore script (reverse symlinks, restore backups)

### Phase 5 — Work vs Personal Separation

Keep work-specific configs separate without leaking into personal.

- [ ] Define strategy: profiles directory vs conditional sourcing
- [ ] Add `shell/.zshrc.work` for work-specific aliases, paths, env vars
- [ ] Add work `.gitconfig` overrides (different email, signing key)
- [ ] Document how to activate work profile on work machine
- [ ] Ensure no work secrets end up in the repo

### Phase 6 — App Installation & macOS Setup

Full machine provisioning: install apps, set system preferences.

- [ ] Create `apps/Brewfile` with all apps (formulae + casks + MAS)
- [ ] Create `apps/apps.md` listing all apps with install sources
- [ ] Add `macos/defaults.sh` for system preferences (Dock, Finder, keyboard, etc.)
- [ ] Add Raycast config/preferences export
- [ ] Add AltTab preferences export
- [ ] Add SSH config template (without keys)

### Phase 7 — Nice to Have

- [ ] Evaluate chezmoi if templating needs grow
- [ ] Add GitHub CLI config (`gh/`)
- [ ] Windows setup script (`setup/install.ps1`) if needed
- [ ] Add Homebrew bundle dump automation (keep Brewfile in sync)

## Config Sync Strategy

Currently using **git + manual symlinks**. Simple, transparent, no extra tools needed.

A symlink is just a pointer — `~/.zshrc` points to `~/dotfiles/shell/.zshrc`. Edits happen in one place, git tracks everything. Safe to create and delete (deleting a symlink does NOT delete the original file).

### Symlink Reference

```bash
# --- AI Tools ---
ln -sf ~/dotfiles/ai/claude/CLAUDE.md ~/.claude/CLAUDE.md
ln -sf ~/dotfiles/ai/claude/settings.json ~/.claude/settings.json
ln -sf ~/dotfiles/ai/cursor/mcp.json ~/.cursor/mcp.json
ln -sf ~/dotfiles/ai/gemini/GEMINI.md ~/.gemini/GEMINI.md
ln -sf ~/dotfiles/ai/gemini/settings.json ~/.gemini/settings.json
ln -sf ~/dotfiles/ai/windsurf/mcp_config.json ~/.codeium/windsurf/mcp_config.json

# --- Shell ---
ln -sf ~/dotfiles/shell/.zshrc ~/.zshrc

# --- Git ---
ln -sf ~/dotfiles/git/.gitconfig ~/.gitconfig
ln -sf ~/dotfiles/git/.gitignore_global ~/.gitignore_global

# --- Editors ---
ln -sf ~/dotfiles/editor/zed/settings.json ~/.config/zed/settings.json

# --- Terminal ---
ln -sf ~/dotfiles/terminal/.p10k.zsh ~/.p10k.zsh
```
