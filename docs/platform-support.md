# Platform Support

The CLI supports three platforms through platform-aware registry entries and conditional collectors.

## Supported Platforms

| Platform | `process.platform` | Status |
|----------|-------------------|--------|
| **macOS** | `darwin` | Full support — all features, all collectors |
| **Linux** | `linux` | Full support — file-based configs, no macOS-specific collectors |
| **Windows** | `win32` | Registry paths defined — shell configs excluded, no Homebrew/apps |

## How Platform Support Works

### Registry Path Resolution

Each `ConfigEntry` has per-platform paths:

```typescript
{
  id: "editor.cursor",
  paths: {
    darwin: "~/Library/Application Support/Cursor/User/settings.json",
    linux: "~/.config/Cursor/User/settings.json",
    win32: "%APPDATA%/Cursor/User/settings.json",
  },
  // ...
}
```

At runtime, `resolvePath()` picks the path for the current platform:

```typescript
function resolvePath(entry: ConfigEntry, home: string): string | null {
  const template = entry.paths[process.platform];
  if (!template) return null;  // No path → auto-skip
  return template
    .replace("~", home)
    .replace("%APPDATA%", Bun.env.APPDATA ?? "")
    .replace("%USERPROFILE%", Bun.env.USERPROFILE ?? home);
}
```

If an entry has **no path for the current platform**, it returns `null` and the entry is skipped across collection, backup, and restore.

### Path Templates

| Template | Expansion | Used By |
|----------|-----------|---------|
| `~` | `$HOME` (from `getHome()`) | All platforms |
| `%APPDATA%` | `process.env.APPDATA` | Windows |
| `%USERPROFILE%` | `process.env.USERPROFILE` (fallback: `$HOME`) | Windows |

### Platform Guards

macOS-specific collectors have explicit platform guards:

```typescript
// src/collectors/apps.ts
export const collectApps: Collector = async () => {
  if (process.platform !== "darwin") return {};
  // ...
};

// src/collectors/homebrew.ts
export const collectHomebrew: Collector = async () => {
  if (process.platform !== "darwin") return {};
  // ...
};
```

These return empty results on non-macOS platforms — no errors, no warnings.

## Platform-Specific Behaviors

### macOS (`darwin`)

| Feature | Details |
|---------|---------|
| All registry entries | 23 entries with `darwin` paths |
| Homebrew collector | `brew list --formula`, `brew list --cask` |
| Apps collector | `/Applications` scan, Raycast, AltTab checks |
| Ollama collector | `ollama list` (if installed) |
| SSH collector | `~/.ssh/config` parsing |
| Path style | `~/Library/Application Support/...` for app-specific configs |

### Linux

| Feature | Details |
|---------|---------|
| Most registry entries | Same as macOS for `~/.config/...` paths |
| No Homebrew | Collector returns `{}` |
| No macOS apps | Collector returns `{}` |
| Ollama collector | Works if Ollama is installed |
| SSH collector | Works normally |
| Path style | `~/.config/...` for XDG-compliant configs |

### Windows (`win32`)

| Feature | Details |
|---------|---------|
| Registry entries | AI tools, git, editors, SSH, npm, bun — all have `win32` paths |
| No shell configs | `.zshrc`, `.p10k.zsh`, `.tmux.conf` have no `win32` path → auto-skipped |
| No Homebrew | Platform guard |
| No macOS apps | Platform guard |
| Path style | `%APPDATA%/...`, `%USERPROFILE%/...` |

## Per-Entry Platform Coverage

| Entry | macOS | Linux | Windows |
|-------|-------|-------|---------|
| `ai.claude.settings` | `~/.claude/settings.json` | `~/.claude/settings.json` | `%USERPROFILE%/.claude/settings.json` |
| `ai.claude.skills` | `~/.claude/skills` | `~/.claude/skills` | `%USERPROFILE%/.claude/skills` |
| `ai.claude.md` | `~/.claude/CLAUDE.md` | `~/.claude/CLAUDE.md` | `%USERPROFILE%/.claude/CLAUDE.md` |
| `ai.cursor.mcp` | `~/.cursor/mcp.json` | `~/.cursor/mcp.json` | `%USERPROFILE%/.cursor/mcp.json` |
| `ai.cursor.skills` | `~/.cursor/skills` | `~/.cursor/skills` | `%USERPROFILE%/.cursor/skills` |
| `ai.gemini.settings` | `~/.gemini/settings.json` | `~/.gemini/settings.json` | `%USERPROFILE%/.gemini/settings.json` |
| `ai.gemini.skills` | `~/.gemini/skills` | `~/.gemini/skills` | `%USERPROFILE%/.gemini/skills` |
| `ai.gemini.md` | `~/.gemini/GEMINI.md` | `~/.gemini/GEMINI.md` | `%USERPROFILE%/.gemini/GEMINI.md` |
| `ai.windsurf.mcp` | `~/.codeium/windsurf/mcp_config.json` | `~/.codeium/windsurf/mcp_config.json` | `%USERPROFILE%/.codeium/windsurf/mcp_config.json` |
| `ai.windsurf.skills` | `~/.codeium/windsurf/skills` | `~/.codeium/windsurf/skills` | `%USERPROFILE%/.codeium/windsurf/skills` |
| `shell.zshrc` | `~/.zshrc` | `~/.zshrc` | — |
| `git.config` | `~/.gitconfig` | `~/.gitconfig` | `%USERPROFILE%/.gitconfig` |
| `git.ignore` | `~/.gitignore_global` | `~/.gitignore_global` | `%USERPROFILE%/.gitignore_global` |
| `gh.config` | `~/.config/gh/config.yml` | `~/.config/gh/config.yml` | `%APPDATA%/GitHub CLI/config.yml` |
| `editor.zed` | `~/.config/zed/settings.json` | `~/.config/zed/settings.json` | `%APPDATA%/Zed/settings.json` |
| `editor.cursor` | `~/Library/Application Support/Cursor/User/settings.json` | `~/.config/Cursor/User/settings.json` | `%APPDATA%/Cursor/User/settings.json` |
| `editor.nvim` | `~/.config/nvim/init.lua` | `~/.config/nvim/init.lua` | `%USERPROFILE%/AppData/Local/nvim/init.lua` |
| `editor.vimrc` | `~/.vimrc` | `~/.vimrc` | `%USERPROFILE%/_vimrc` |
| `terminal.p10k` | `~/.p10k.zsh` | `~/.p10k.zsh` | — |
| `terminal.tmux` | `~/.tmux.conf` | `~/.tmux.conf` | — |
| `ssh.config` | `~/.ssh/config` | `~/.ssh/config` | `%USERPROFILE%/.ssh/config` |
| `npm.config` | `~/.npmrc` | `~/.npmrc` | `%USERPROFILE%/.npmrc` |
| `bun.config` | `~/.bunfig.toml` | `~/.bunfig.toml` | `%USERPROFILE%/.bunfig.toml` |

Entries with `—` have no path defined for that platform and are automatically excluded.

## Platform Filtering

`getEntriesForPlatform(entries)` filters the registry to only entries that have a path for the current OS:

```typescript
function getEntriesForPlatform(entries: ConfigEntry[]): ConfigEntry[] {
  const platform = process.platform as Platform;
  return entries.filter((e) => e.paths[platform] !== undefined);
}
```

This is used by the backup source generator to avoid creating sources for irrelevant entries.
