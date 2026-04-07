# @dotformat/cli

**Machine identity CLI** — collect, backup, restore, scan, compare, and diff your configs across machines. Built on [Bun](https://bun.sh), outputs structured `.dotf` snapshots and registry-driven file backups with built-in sensitivity scanning.

| | |
|---|---|
| **Runtime** | [Bun](https://bun.sh) >= 1.0 (required) |
| **Package** | `@dotformat/cli` |
| **Format** | [`@dotformat/core`](https://github.com/doguyilmaz/dotformat) `.dotf` parser/stringify/compare |
| **Tests** | 102 tests, 307 assertions |
| **Platforms** | macOS, Linux, Windows |

---

## What It Does

**Snapshot** your machine config into a single parseable `.dotf` file — AI tools, shell, git, editors, SSH, brew, apps, and more. **Back up** real config files into a structured directory. **Restore** them on a new machine with conflict resolution and rollback. **Diff** your backup against live state. **Scan** for secrets and sensitive data automatically.

---

## Install

```bash
# Run directly (no install)
bunx @dotformat/cli collect

# Or clone and run
git clone https://github.com/doguyilmaz/dotfiles.git
cd dotfiles && bun install
bun bin/dotfiles.ts collect
```

---

## Commands

### `collect` — Machine snapshot

```bash
dotfiles collect [--no-redact] [--slim] [-o path]
```

Generates a `.dotf` report with all detected configs. Runs all collectors in parallel via `Promise.allSettled`.

| Flag | Effect |
|------|--------|
| `--no-redact` | Include sensitive values as-is |
| `--slim` | Truncate content sections to 10 lines (AI-friendly, ~65% smaller) |
| `-o path` | Custom output directory |

Output: `<hostname>-YYYYMMDDHHMMSS.dotf`

### `backup` — Structured file copy

```bash
dotfiles backup [--no-redact] [--archive] [--only ai,shell] [--skip editor] [-o path]
```

Copies real config files into a categorized directory structure. Sensitivity scan runs before every write.

| Flag | Effect |
|------|--------|
| `--archive` | Export as `.tar.gz` (uses system tar) |
| `--only <categories>` | Include only these categories |
| `--skip <categories>` | Exclude these categories |
| `--no-redact` | Skip sensitivity redaction |
| `-o path` | Custom output directory |

Output: `backup-<hostname>-YYYYMMDDHHMMSS/`

### `restore` — Restore from backup

```bash
dotfiles restore <path> [--pick] [--dry-run]
```

Restores backed-up files to their original locations with safety features:

- **Pre-restore snapshot**: saves conflicting files before overwrite (reversible via `dotfiles restore`)
- **Conflict prompt**: `o` overwrite / `s` skip / `d` show diff / `a` overwrite all / `l` skip all
- **Redacted files**: automatically skipped (won't write `[REDACTED]` values)
- **`.local` overrides**: `backup/shell/.zshrc.local` restores to `~/.zshrc.local`

### `scan` — Sensitivity scanner

```bash
dotfiles scan [path]
```

Standalone scan for secrets, tokens, and sensitive data. Scans directories recursively (skips `.git/`, `node_modules/`, files >1MB).

Detects 27+ patterns across 3 severity levels — see [Sensitivity](#sensitivity-model) below.

### `diff` — Backup vs live

```bash
dotfiles diff [path] [--section <name>]
```

Color-coded comparison of backup state against current machine. Auto-finds latest backup if no path given. TTY-aware (no colors in pipes).

### `status` — Quick summary

```bash
dotfiles status
```

Shows backup age, modified/unchanged counts, lists changed files.

### `compare` — Diff two reports

```bash
dotfiles compare [file1] [file2]
```

Structured diff between two `.dotf` files. Without args, compares the newest two reports in `<cwd>/reports`.

### `list` — Query a report

```bash
dotfiles list <section>
```

Print a section from the latest report. Fuzzy matching: `brew`, `ai`, `cursor` all work.

---

## Config Registry

All config sources are defined in a single registry (`src/registry/entries.ts`). Each entry specifies:

- **ID**: section name (e.g., `ai.claude.settings`)
- **Paths**: per-platform (`darwin`, `linux`, `win32`)
- **Kind**: `file` | `dir` | `json-extract` | `file` + `metadata`
- **Category**: powers `--only` / `--skip` filtering
- **Sensitivity**: `low` / `medium` / `high`
- **Redact**: optional custom redaction function

### What's Tracked

| Category | Configs |
|----------|---------|
| **ai** | Claude (settings, skills, CLAUDE.md), Cursor (MCP, skills), Gemini (settings, skills, GEMINI.md), Windsurf (MCP, skills) |
| **shell** | `.zshrc` |
| **git** | `.gitconfig`, `.gitignore_global`, GitHub CLI config |
| **editor** | Zed, Cursor, Neovim, Vim |
| **terminal** | `.p10k.zsh` (metadata), `.tmux.conf` |
| **ssh** | SSH config (auto-redacted) |
| **npm** | `.npmrc` (auto-redacted) |
| **bun** | `.bunfig.toml` |

Plus runtime collectors (not registry-driven): **meta** (hostname, OS, date), **SSH hosts** (structured parsed table), **Ollama models**, **Homebrew** (formulae + casks), **apps** (macOS `/Applications`, Raycast, AltTab).

---

## Sensitivity Model

Three-stage pipeline that runs automatically on `collect` and `backup`:

**1. Detection** — regex pattern matching per line
**2. Classification** — HIGH / MEDIUM / LOW severity
**3. Action** — `skip` (drop file), `redact` (replace values), or `include` (keep as-is)

### Detected Patterns (27+)

| Severity | Patterns |
|----------|----------|
| **HIGH** | Private keys (PEM, PGP), auth tokens (npm, Bearer), GitHub tokens (`ghp_`, `gho_`, `github_pat_`), AI keys (OpenAI `sk-`, Anthropic `sk-ant-`), AWS keys (`AKIA...`, secret key), Google API/OAuth/Firebase, Cloudflare, Stripe (`sk_live_`, `pk_test_`), Mapbox, Twilio, SendGrid, Slack (`xoxb-`), Discord, Supabase, Vercel, JWT tokens, database URLs (postgres/mysql/mongodb/redis), generic `SECRET=`/`API_KEY=`/`PASSWORD=` patterns |
| **MEDIUM** | IP addresses, email addresses |
| **LOW** | Home directory paths (`/Users/<username>/`) |

### Default Actions

- **Private keys** → skip entire file
- **Auth tokens, API keys, DB URLs** → redact values with `[REDACTED]`
- **IP addresses** → redact
- **Email addresses** → include (warn only)
- **Home paths** → include

Override with `--no-redact` when you control the destination.

---

## Output Path Logic

| Condition | Output Directory |
|-----------|-----------------|
| `-o /path` given | Explicit path |
| Running from cloned repo (`.git` in cwd) | `<cwd>/reports/` |
| Running as global CLI | `~/Downloads` |

---

## Backup Directory Structure

```
backup-<hostname>-YYYYMMDDHHMMSS/
├── ai/
│   ├── claude/
│   │   ├── settings.json
│   │   ├── CLAUDE.md
│   │   └── skills/
│   ├── cursor/
│   │   ├── mcp.json
│   │   └── skills/
│   ├── gemini/
│   │   ├── settings.json
│   │   ├── GEMINI.md
│   │   └── skills/
│   └── windsurf/
│       ├── mcp_config.json
│       └── skills/
├── shell/
│   └── .zshrc
├── git/
│   ├── .gitconfig
│   ├── .gitignore_global
│   └── gh/config.yml
├── editor/
│   ├── zed/settings.json
│   ├── cursor/settings.json
│   ├── nvim/init.lua
│   └── .vimrc
├── terminal/
│   ├── .p10k.zsh
│   └── .tmux.conf
├── ssh/
│   └── config              # redacted by default
├── npm/
│   └── .npmrc              # redacted by default
└── bun/
    └── .bunfig.toml
```

Only creates directories/files that actually exist on the machine.

---

## Project Structure

```
dotfiles/
├── bin/
│   └── dotfiles.ts              # Entry point (Bun runtime check)
├── src/
│   ├── cli.ts                   # Command router (8 commands)
│   ├── commands/
│   │   ├── collect.ts           # .dotf snapshot generation
│   │   ├── backup.ts            # Structured file backup
│   │   ├── scan.ts              # Standalone sensitivity scan
│   │   ├── restore.ts           # Restore from backup
│   │   ├── diff.ts              # Backup vs live comparison
│   │   ├── status.ts            # Quick backup summary
│   │   ├── compare.ts           # Diff two .dotf files
│   │   └── list.ts              # Fuzzy section query
│   ├── registry/
│   │   ├── types.ts             # ConfigEntry, Platform, EntryKind
│   │   ├── entries.ts           # 23 config entries (single source of truth)
│   │   ├── resolve.ts           # Platform-aware path resolution
│   │   ├── collector.ts         # Registry → Collector generator
│   │   ├── backup.ts            # Registry → BackupSource generator
│   │   └── index.ts             # Public exports
│   ├── collectors/
│   │   ├── types.ts             # CollectorContext, CollectorResult, Collector
│   │   ├── meta.ts              # hostname, OS, date
│   │   ├── ssh.ts               # Structured SSH host parsing
│   │   ├── ollama.ts            # Ollama model list
│   │   ├── apps.ts              # macOS apps, Raycast, AltTab
│   │   └── homebrew.ts          # brew formulae + casks
│   ├── scan/
│   │   ├── types.ts             # ScanPattern, ScanResult, Severity
│   │   ├── patterns.ts          # 27+ detection patterns (cached)
│   │   ├── scanner.ts           # scanContent, scanFile, summarize
│   │   ├── redactor.ts          # applyRedactions
│   │   ├── report.ts            # Sensitivity report formatter
│   │   └── index.ts
│   ├── backup/
│   │   ├── types.ts             # BackupEntry, BackupSource
│   │   └── sources.ts           # Registry-generated backup sources
│   ├── restore/
│   │   ├── types.ts             # RestoreEntry, RestorePlan, FileStatus
│   │   ├── plan.ts              # buildRestoreMap, buildRestorePlan
│   │   ├── execute.ts           # executeRestore, createSnapshot
│   │   ├── prompt.ts            # Interactive conflict prompts
│   │   └── index.ts
│   └── utils/
│       ├── constants.ts         # REDACTION_MARKER
│       ├── home.ts              # getHome() with validation
│       ├── redact.ts            # SSH/npm custom redaction functions
│       ├── resolve-output.ts    # Output directory resolution
│       ├── find-backup.ts       # Latest backup finder + age calc
│       └── timestamp.ts         # YYYYMMDDHHMMSS generator
├── tests/                       # 102 tests across 14 files
├── docs/                        # VitePress documentation site
└── package.json
```

---

## Development

```bash
bun install
bun test                    # 102 tests, 307 assertions
bun bin/dotfiles.ts <cmd>   # Run locally
```

### Docs (VitePress)

```bash
bun run docs:dev            # Dev server with hot reload
bun run docs:build          # Build static site
bun run docs:preview        # Preview build
```

Full documentation: [docs/](./docs/) — commands, architecture, sensitivity patterns, execution flows, behavior reference.

---

## Platform Support

| Platform | Path Expansion | Notes |
|----------|---------------|-------|
| **macOS** (`darwin`) | `~` → `$HOME`, `~/Library/...` | Full support, Homebrew/apps collectors |
| **Linux** | `~` → `$HOME`, `~/.config/...` | Full support, no Homebrew/apps |
| **Windows** (`win32`) | `%APPDATA%`, `%USERPROFILE%` | Registry paths defined, shell configs excluded |

---

## Roadmap

Completed: CLI rewrite, backup, sensitivity scan, restore, diff, config registry, multi-OS, status, `--slim`, parallel collectors, archive export.

Next: `init` (GitHub template flow), plugin system for community collectors. See [PLAN.md](./PLAN.md) for full details.

---

## License

`UNLICENSED` — intended MIT for public release. See [package.json](./package.json).
