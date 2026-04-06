# Dotfiles CLI — Master Plan

> The ultimate machine identity tool. Collect, backup, restore, compare, and sync configs across machines.

**Runtime:** Bun (required) — uses `Bun.file()`, `Bun.$`, `Bun.Glob` throughout
**Depends on:** `@dotformat/core` (parse, stringify, compare, formatDiff)
**Package:** `@dotformat/cli`

---

## User Journeys

### Journey A: "What's on my machine?"
Single-file `.dotf` snapshot — parseable, diffable, queryable.

```bash
dotfiles collect                    # → reports/<hostname>.dotf
dotfiles list models                # → fuzzy query a section
dotfiles compare home.dotf work.dotf # → structured diff
```

**Status: Done (Phase 4)**

### Journey B: "Back up my configs"
Real file copies in structured directories. Two tracks:

```
                    ┌─────────────────┐
                    │  dotfiles CLI    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
        Clone track                    CLI-only track
     (power users)                   (quick & portable)
              │                             │
    ┌─────────┴─────────┐          ┌───────┴───────┐
    │ Real files in repo │          │ Single .dotf  │
    │ shell/.zshrc       │          │ snapshot file │
    │ ai/claude/...      │          │ (carry/email) │
    │ git/.gitconfig     │          └───────────────┘
    └─────────┬──────────┘
              │
     git push to private repo
     (user's storage, not ours)
```

**Status: Planned (Phase 5)**

### Journey C: "Set up a new machine"
Restore from backup. Interactive picker. Conflict resolution.

```bash
dotfiles restore ./backup --pick --dry-run
```

**Status: Planned (Phase 6)**

---

## Sensitivity Model

Never silent about sensitive data. Three layers:

1. **Detection** — regex patterns (tokens, keys, IPs, passwords, private keys)
2. **Classification** — HIGH (private keys, auth tokens) / MEDIUM (IPs, emails) / LOW (usernames, paths)
3. **Action** — per-finding: redact / skip / include / warn-only

Runs automatically during `backup` and `collect`. Summary at the end:

```
⚠ Sensitivity report:
  HIGH   ~/.ssh/id_ed25519         private key — skipped
  HIGH   ~/.npmrc                  auth token — redacted
  MEDIUM ~/.gitconfig              email address — included

  2 items redacted, 1 skipped. Use --no-redact to include all.
```

Also available standalone: `dotfiles scan [path]`

---

## Output Path Logic

- `-o /path` → explicit custom directory
- Running from cloned repo (`.git` detected in cwd) → `reports/` under repo root
- Running as global CLI (no `.git`) → `~/Downloads`

---

## Phase 4 — CLI Rewrite (Done)

Rewrote bash script → Bun/TypeScript CLI outputting `.dotf` files.

### Commands

```bash
dotfiles collect [--no-redact] [-o path]
dotfiles compare [file1] [file2]
dotfiles list <section>
```

### Collector Pattern

```typescript
interface CollectorContext {
  redact: boolean   // true by default
  home: string      // $HOME — injected for testability
}

type CollectorResult = Record<string, DotfSection>
type Collector = (ctx: CollectorContext) => Promise<CollectorResult>
```

- Returns `{}` if tool/file not found (no errors for missing stuff)
- Uses `Bun.file()` for reads, `Bun.$` for shell commands
- Wraps `Bun.$` calls in try/catch (brew, ollama may not be installed)

### Section Mapping

| Section | Type | Source |
|---|---|---|
| `meta` | pairs | hostname, OS, date |
| `ai.claude.settings` | pairs | `~/.claude/settings.json` (permissions + enabledPlugins) |
| `ai.claude.skills` | items | `ls ~/.claude/skills/` |
| `ai.claude.md` | content | `~/.claude/CLAUDE.md` |
| `ai.cursor.mcp` | content | `~/.cursor/mcp.json` |
| `ai.cursor.skills` | items | `ls ~/.cursor/skills/` |
| `ai.gemini.settings` | pairs | `~/.gemini/settings.json` |
| `ai.gemini.skills` | items | `ls ~/.gemini/skills/` |
| `ai.gemini.md` | content | `~/.gemini/GEMINI.md` |
| `ai.windsurf.mcp` | content | `~/.codeium/windsurf/mcp_config.json` |
| `ai.windsurf.skills` | items | `ls ~/.codeium/windsurf/skills/` |
| `ai.ollama.models` | items (piped) | `ollama list` parsed |
| `shell.zshrc` | content | `~/.zshrc` |
| `git.config` | content | `~/.gitconfig` |
| `gh.config` | content | `~/.config/gh/config.yml` |
| `editor.zed` | content | `~/.config/zed/settings.json` |
| `editor.cursor` | content | `~/Library/.../Cursor/User/settings.json` |
| `terminal.p10k` | pairs | exists + line count |
| `ssh.hosts` | items (piped) | `~/.ssh/config` parsed, redacted |
| `npm.config` | content | `~/.npmrc` redacted |
| `bun.config` | content | `~/.bunfig.toml` |
| `apps.raycast` | pairs | installed check |
| `apps.alttab` | pairs | installed + prefs |
| `apps.macos` | items | `ls /Applications/` |
| `apps.brew.formulae` | items | `brew list --formula` |
| `apps.brew.casks` | items | `brew list --cask` |
| `terminal.tmux` | content | `~/.tmux.conf` |
| `editor.nvim` | content | `~/.config/nvim/init.lua` or `~/.vimrc` |

### File Structure

```
dotfiles/
├── src/
│   ├── cli.ts                    # Entry point — command routing
│   ├── commands/
│   │   ├── collect.ts            # Orchestrates all collectors → .dotf file
│   │   ├── compare.ts            # Diffs two .dotf reports
│   │   └── list.ts               # Fuzzy section query
│   ├── collectors/
│   │   ├── types.ts              # CollectorContext, CollectorResult, makeSection
│   │   ├── meta.ts, claude.ts, cursor.ts, gemini.ts, windsurf.ts
│   │   ├── ollama.ts, shell.ts, git.ts, gh.ts, editors.ts
│   │   ├── terminal.ts, ssh.ts, npm.ts, bun-config.ts
│   │   ├── apps.ts, homebrew.ts
│   └── utils/
│       └── redact.ts             # Redaction patterns
├── tests/
│   ├── collectors/               # meta, ssh, npm, claude tests
│   ├── commands/                 # list fuzzy match tests
│   └── utils/                    # redact tests
├── bin/
│   └── dotfiles.ts               # #!/usr/bin/env bun
└── package.json
```

---

## Phase 5 — Backup (structured file copy)

`dotfiles backup [-o path] [--only ai,shell] [--skip editors]`

Real files in real directory structure. Only creates what exists (no empty folders).

```
backup/
├── ai/
│   ├── claude/
│   │   ├── settings.json
│   │   ├── CLAUDE.md
│   │   └── skills/
│   ├── cursor/
│   │   └── mcp.json
│   ├── gemini/
│   │   ├── settings.json
│   │   └── GEMINI.md
│   └── windsurf/
│       └── mcp_config.json
├── shell/
│   └── .zshrc
├── git/
│   ├── .gitconfig
│   └── .gitignore_global
├── editor/
│   ├── zed/settings.json
│   └── cursor/settings.json
├── terminal/
│   └── .p10k.zsh
├── ssh/
│   └── config              # redacted by default
├── npm/
│   └── .npmrc              # redacted by default
└── bun/
    └── .bunfig.toml
```

### Key decisions

- Reuses collector pattern — each collector gains a `sourcePaths()` method
- Sensitivity scan runs before writing (Phase 7)
- `--only` / `--skip` for selective backup
- Clone track: writes into repo structure → user commits
- CLI-only track: still uses `.dotf` single-file export

---

## Phase 6 — Restore

`dotfiles restore <path> [--pick] [--dry-run]`

```bash
dotfiles restore ./backup              # restore everything
dotfiles restore ./backup --pick       # interactive section picker
dotfiles restore ./backup --dry-run    # preview only, no changes
```

- `--pick` → checkbox UI: select which configs to restore
- `--dry-run` → shows what would change, doesn't touch anything
- Conflict handling: if target file differs, prompt overwrite / skip / show diff
- Supports `.local` override pattern: if `backup/shell/.zshrc.local` exists, restore it alongside `.zshrc`

---

## Phase 7 — Sensitivity Scan

`dotfiles scan [path]` — also runs automatically during backup/collect.

### Detection patterns

| Level | Pattern | Example |
|---|---|---|
| HIGH | Private key headers | `-----BEGIN.*PRIVATE KEY-----` |
| HIGH | Auth tokens | `_authToken=`, `Bearer `, `sk-`, `ghp_`, `npm_` |
| HIGH | AWS keys | `AKIA...`, `aws_secret_access_key` |
| MEDIUM | IP addresses | `\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b` |
| MEDIUM | Email addresses | `\b\w+@\w+\.\w+\b` |
| LOW | Home directory paths | `/Users/<username>/`, `/home/<username>/` |

### Actions

- `redact` → replace value with `[REDACTED]` (default for HIGH)
- `skip` → exclude entire file from output (default for private keys)
- `include` → keep as-is with warning (default for LOW)
- `--no-redact` → bypass all, include everything

---

## Phase 8 — Diff Against Live

`dotfiles diff [--section ai]`

Compares repo backup against current machine state. Answers: "what changed since last backup?"

```bash
dotfiles diff
# shell/.zshrc — modified (3 lines added)
# ai/claude/settings.json — modified (2 plugins added)
# editor/cursor/settings.json — unchanged
# ai/windsurf/mcp_config.json — new file (not in backup)
```

- Uses `@dotformat/core` compare under the hood
- Color-coded: green (unchanged), yellow (modified), red (deleted from machine), blue (new on machine)
- `--section` flag for scoped diff

---

## Phase 9 — Init (GitHub template flow)

`dotfiles init` → guided onboarding for new users.

### New user (no repo)

```bash
bunx @dotformat/cli init
  → "Create a private GitHub repo? (y/n)"
  → gh repo create my-dotfiles --private --template dotformat/template
  → cd my-dotfiles
  → dotfiles backup
  → git add . && git commit -m "initial backup"
  → git push
  → "Done. Your configs are backed up to github.com/you/my-dotfiles"
```

### New machine (has repo)

```bash
git clone github.com/you/my-dotfiles
cd my-dotfiles
dotfiles restore --pick
  → [ ] shell/.zshrc
  → [x] ai/claude/settings.json
  → [x] ai/claude/CLAUDE.md
  → [ ] git/.gitconfig
  → "Restore 2 selected configs? (y/n)"
```

### One-line remote install

```bash
curl -fsSL https://raw.githubusercontent.com/you/my-dotfiles/main/install.sh | bash
```

### Rules

- We never store user data — their GitHub is the storage
- Zero cloud, zero accounts beyond what they already have
- `gh` CLI required for repo creation (optional: manual git init fallback)

---

## Phase 10 — Config Registry

Extensible manifest of what configs exist and where they live on each OS.

```typescript
// src/registry.ts
const registry: ConfigEntry[] = [
  {
    id: "shell.zshrc",
    name: ".zshrc",
    paths: {
      darwin: "~/.zshrc",
      linux: "~/.zshrc",
    },
    category: "shell",
    sensitivity: "low",
  },
  {
    id: "editor.cursor",
    name: "Cursor Settings",
    paths: {
      darwin: "~/Library/Application Support/Cursor/User/settings.json",
      linux: "~/.config/Cursor/User/settings.json",
      win32: "%APPDATA%/Cursor/User/settings.json",
    },
    category: "editor",
    sensitivity: "low",
  },
  // Users can add custom entries...
];
```

- Replaces hardcoded paths in collectors
- Users extend via `dotfiles.config.ts` or `dotfiles add ~/.config/starship.toml`
- Enables multi-OS support without rewriting collectors
- Categories power `--only` / `--skip` filtering

---

## Phase 11 — Multi-OS

- macOS: `~/Library/Application Support/...`
- Linux: `~/.config/...`
- Windows: `%APPDATA%/...`
- Uses Config Registry (Phase 10) for path resolution
- OS-specific collectors (e.g., `brew` only on macOS, `apt` on Linux, `winget` on Windows)

---

## Ideas Backlog

- [x] Timestamped report filenames — `<hostname>-YYYYMMDDHHMMSS.dotf`, no overwrites
- [ ] `--slim` flag for `collect` — AI token-efficient snapshots
- [ ] `.local` override pattern — separate shared vs machine-specific configs (inspired by gko/dotfiles)
- [ ] `--assume-unchanged` for sensitive template files in GitHub flow
- [ ] Profile switching — `dotfiles use work` / `dotfiles use personal`
- [ ] Encryption for sensitive files — encrypt with passphrase before storing, decrypt on restore
- [ ] `dotfiles status` — quick summary of what's changed, what's backed up, what's new
- [ ] Shallow clone + submodules for fast remote install
- [ ] Plugin system — community collectors for tools we don't cover
- [ ] Update README with Bun requirement and full CLI usage docs

---

## Priority Order

| # | Phase | What | Depends on |
|---|---|---|---|
| 1 | ~~Phase 4~~ | CLI rewrite (collect, compare, list) | Done |
| 2 | Phase 5 | Backup (structured file copy) | — |
| 3 | Phase 7 | Sensitivity scan | Before backup ships |
| 4 | Phase 6 | Restore (with --pick, --dry-run) | Backup |
| 5 | Phase 8 | Diff against live system | Backup |
| 6 | Phase 9 | Init (GitHub template) | Backup + Restore |
| 7 | Phase 10 | Config registry | — |
| 8 | Phase 11 | Multi-OS | Config registry |
