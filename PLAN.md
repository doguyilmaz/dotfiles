# Phase 4 — Dotfiles CLI Rewrite in Bun

## Context

The dotfiles repo has a bash script (`setup/collect-machine-config.sh`) that collects machine configs and outputs markdown reports. Markdown is unstructured — hard to diff, impossible to parse programmatically. Phase 4 rewrites this in Bun/TypeScript, outputting `.dotf` files using `@dotformat/core`.

**Depends on:** `@dotformat/core` (parse, stringify, compare, formatDiff)

## File Structure

```
dotfiles/
├── src/
│   ├── cli.ts                    # Entry point — command routing
│   ├── commands/
│   │   ├── collect.ts            # Orchestrates all collectors → .dotf file
│   │   ├── compare.ts            # Diffs two .dotf reports (uses @dotformat/core)
│   │   └── list.ts               # Prints a single section from a report
│   ├── collectors/
│   │   ├── types.ts              # CollectorContext, CollectorResult types
│   │   ├── meta.ts               # hostname, OS, date
│   │   ├── claude.ts             # settings.json plugins, skills, CLAUDE.md
│   │   ├── cursor.ts             # mcp.json, skills
│   │   ├── gemini.ts             # settings.json, GEMINI.md, skills
│   │   ├── windsurf.ts           # mcp_config.json, skills
│   │   ├── ollama.ts             # ollama list (models + sizes + dates)
│   │   ├── shell.ts              # .zshrc content
│   │   ├── git.ts                # .gitconfig content
│   │   ├── gh.ts                 # gh config.yml content
│   │   ├── editors.ts            # Zed + Cursor editor settings
│   │   ├── terminal.ts           # p10k check
│   │   ├── ssh.ts                # SSH config → host items (redacted)
│   │   ├── npm.ts                # .npmrc (token redacted)
│   │   ├── bun-config.ts         # bunfig.toml
│   │   ├── apps.ts               # /Applications, Raycast, AltTab
│   │   └── homebrew.ts           # brew formulae + casks
│   └── utils/
│       └── redact.ts             # Redaction patterns + helpers
├── tests/
│   ├── collectors/               # Collector unit tests
│   └── utils/
│       └── redact.test.ts        # Redaction pattern tests
├── bin/
│   └── dotfiles.ts               # #!/usr/bin/env bun shebang entry
└── package.json                  # @dotformat/cli, depends on @dotformat/core
```

## CLI Commands

```bash
dotfiles collect                      # → reports/<hostname>.dotf
dotfiles collect --no-redact          # real IPs/keys included
dotfiles collect -o /custom/path      # custom output dir
dotfiles compare                      # auto-picks 2 most recent .dotf reports
dotfiles compare home.dotf work.dotf  # explicit files
dotfiles list models                  # fuzzy-matches section name, prints it
```

## Collector Pattern

Each collector is an async function that returns named sections:

```typescript
// src/collectors/types.ts
interface CollectorContext {
  redact: boolean   // true by default, false with --no-redact
  home: string      // $HOME — injected for testability
}

type CollectorResult = Record<string, DotfSection>
type Collector = (ctx: CollectorContext) => Promise<CollectorResult>
```

- Returns `{}` if tool/file not found (no errors for missing stuff)
- Uses `Bun.file()` for reads, `Bun.$` for shell commands
- Wraps `Bun.$` calls in try/catch (brew, ollama may not be installed)

## Section Mapping

| Section | Type | Source |
|---|---|---|
| `meta` | pairs | hostname, OS, date |
| `ai.claude.plugins` | pairs | `~/.claude/settings.json` |
| `ai.claude.skills` | items | `ls ~/.claude/skills/` |
| `file:claude/CLAUDE.md` | content | `~/.claude/CLAUDE.md` |
| `ai.cursor.mcp` | content | `~/.cursor/mcp.json` |
| `ai.cursor.skills` | items | `ls ~/.cursor/skills/` |
| `ai.gemini.settings` | pairs | `~/.gemini/settings.json` |
| `ai.gemini.skills` | items | `ls ~/.gemini/skills/` |
| `file:gemini/GEMINI.md` | content | `~/.gemini/GEMINI.md` |
| `ai.windsurf.mcp` | content | `~/.codeium/windsurf/mcp_config.json` |
| `ai.windsurf.skills` | items | `ls ~/.codeium/windsurf/skills/` |
| `ai.ollama.models` | items (piped) | `ollama list` parsed |
| `file:shell/zshrc` | content | `~/.zshrc` |
| `file:git/gitconfig` | content | `~/.gitconfig` |
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

JSON configs (MCP, editor settings) stored as content blocks — opaque snapshots, not parsed into key-value.

## Redaction

- Default: `ctx.redact = true`
- SSH: HostName and IdentityFile → `[REDACTED]`
- npm: `_authToken=...` → `_authToken=[REDACTED]`
- IP addresses: `\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b` → `[REDACTED]`
- `--no-redact` flag sets `ctx.redact = false`, bypasses all

## @dotformat/core API Reference

```typescript
// Types
interface DotfDocument { sections: Record<string, DotfSection> }
interface DotfSection { name: string; pairs: Record<string, string>; items: DotfItem[]; content: string | null }
interface DotfItem { raw: string; columns: string[] }

// Functions
parse(input: string): DotfDocument
stringify(doc: DotfDocument): string
compare(left: DotfDocument, right: DotfDocument): DotfDiff
formatDiff(diff: DotfDiff, options?: { leftLabel?: string; rightLabel?: string; color?: boolean }): string
```

To build a `DotfSection`:
```typescript
const section: DotfSection = {
  name: "meta",
  pairs: { host: "MacBook", os: "Darwin arm64" },
  items: [],
  content: null
}
```

To build piped items:
```typescript
const item: DotfItem = {
  raw: "llama3.1:latest | 4.9GB | 2025-05-15",
  columns: ["llama3.1:latest", "4.9GB", "2025-05-15"]
}
```

## Implementation Steps

### Step 1: Scaffold + meta collector
- Create `src/collectors/types.ts`, `src/collectors/meta.ts`
- Create `src/commands/collect.ts` (just meta for now)
- Create `src/cli.ts` (command router)
- Create `bin/dotfiles.ts` (shebang entry)
- Update `package.json` — add `@dotformat/core` dep, `bin` entry, scripts
- Verify: `bun bin/dotfiles.ts collect` → `.dotf` with `[meta]`

### Step 2: Redaction + SSH + npm collectors
- Create `src/utils/redact.ts`
- Create `src/collectors/ssh.ts`, `src/collectors/npm.ts`
- Tests for redaction patterns
- Verify: `[REDACTED]` appears by default, real values with `--no-redact`

### Step 3: AI tool collectors
- `claude.ts`, `cursor.ts`, `gemini.ts`, `windsurf.ts`, `ollama.ts`
- These produce the most sections and are highest value

### Step 4: Remaining collectors
- `shell.ts`, `git.ts`, `gh.ts`, `editors.ts`, `terminal.ts`
- `bun-config.ts`, `apps.ts`, `homebrew.ts`
- All simple file reads or `Bun.$` commands

### Step 5: Compare command
- Wire `@dotformat/core` compare + formatDiff
- Auto-pick 2 most recent `.dotf` files from `reports/`

### Step 6: List command
- Fuzzy section matching ("models" → "ai.ollama.models")
- Print section contents

### Step 7: Cleanup
- Deprecate bash script (add comment pointing to new CLI)
- Update dotfiles README

## Testing Strategy

- **Redaction:** pattern matching, `--no-redact` bypass
- **Collectors:** pass mock `ctx` with temp `home` dir, verify section shapes
- **List:** fuzzy matching logic
- Don't test: file I/O itself, `Bun.$` itself, `@dotformat/core` (already tested)

## Verification Checklist

1. `bun bin/dotfiles.ts collect` → produces `reports/<hostname>.dotf`
2. Open the `.dotf` file — all sections present with correct data
3. `bun bin/dotfiles.ts collect --no-redact` → SSH IPs visible
4. `bun bin/dotfiles.ts compare` → colored diff between 2 reports
5. `bun bin/dotfiles.ts list brew` → lists brew packages
6. `bun test` passes

## Future

- [ ] `--slim` flag for `collect` — extracts structured summaries instead of full content (hash + line count for md files, key prefs only for editor settings, extracted aliases/plugins for zshrc). Useful for AI token-efficient snapshots while default stays full content for backup/restore.
