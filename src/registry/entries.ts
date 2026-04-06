import { redactSshConfig, redactNpmTokens } from "../utils/redact";
import type { ConfigEntry } from "./types";

export const registryEntries: ConfigEntry[] = [
  // === AI: Claude ===
  {
    id: "ai.claude.settings",
    name: "Claude Settings",
    paths: { darwin: "~/.claude/settings.json", linux: "~/.claude/settings.json" },
    category: "ai",
    kind: { type: "json-extract", fields: ["permissions", "enabledPlugins"] },
    backupDest: "ai/claude/settings.json",
    sensitivity: "low",
  },
  {
    id: "ai.claude.skills",
    name: "Claude Skills",
    paths: { darwin: "~/.claude/skills", linux: "~/.claude/skills" },
    category: "ai",
    kind: { type: "dir" },
    backupDest: "ai/claude/skills",
    sensitivity: "low",
  },
  {
    id: "ai.claude.md",
    name: "CLAUDE.md",
    paths: { darwin: "~/.claude/CLAUDE.md", linux: "~/.claude/CLAUDE.md" },
    category: "ai",
    kind: { type: "file" },
    backupDest: "ai/claude/CLAUDE.md",
    sensitivity: "low",
  },

  // === AI: Cursor ===
  {
    id: "ai.cursor.mcp",
    name: "Cursor MCP Config",
    paths: { darwin: "~/.cursor/mcp.json", linux: "~/.cursor/mcp.json" },
    category: "ai",
    kind: { type: "file" },
    backupDest: "ai/cursor/mcp.json",
    sensitivity: "low",
  },
  {
    id: "ai.cursor.skills",
    name: "Cursor Skills",
    paths: { darwin: "~/.cursor/skills", linux: "~/.cursor/skills" },
    category: "ai",
    kind: { type: "dir" },
    backupDest: "ai/cursor/skills",
    sensitivity: "low",
  },

  // === AI: Gemini ===
  {
    id: "ai.gemini.settings",
    name: "Gemini Settings",
    paths: { darwin: "~/.gemini/settings.json", linux: "~/.gemini/settings.json" },
    category: "ai",
    kind: { type: "json-extract", fields: [] },
    backupDest: "ai/gemini/settings.json",
    sensitivity: "low",
  },
  {
    id: "ai.gemini.skills",
    name: "Gemini Skills",
    paths: { darwin: "~/.gemini/skills", linux: "~/.gemini/skills" },
    category: "ai",
    kind: { type: "dir" },
    backupDest: "ai/gemini/skills",
    sensitivity: "low",
  },
  {
    id: "ai.gemini.md",
    name: "GEMINI.md",
    paths: { darwin: "~/.gemini/GEMINI.md", linux: "~/.gemini/GEMINI.md" },
    category: "ai",
    kind: { type: "file" },
    backupDest: "ai/gemini/GEMINI.md",
    sensitivity: "low",
  },

  // === AI: Windsurf ===
  {
    id: "ai.windsurf.mcp",
    name: "Windsurf MCP Config",
    paths: { darwin: "~/.codeium/windsurf/mcp_config.json", linux: "~/.codeium/windsurf/mcp_config.json" },
    category: "ai",
    kind: { type: "file" },
    backupDest: "ai/windsurf/mcp_config.json",
    sensitivity: "low",
  },
  {
    id: "ai.windsurf.skills",
    name: "Windsurf Skills",
    paths: { darwin: "~/.codeium/windsurf/skills", linux: "~/.codeium/windsurf/skills" },
    category: "ai",
    kind: { type: "dir" },
    backupDest: "ai/windsurf/skills",
    sensitivity: "low",
  },

  // === Shell ===
  {
    id: "shell.zshrc",
    name: ".zshrc",
    paths: { darwin: "~/.zshrc", linux: "~/.zshrc" },
    category: "shell",
    kind: { type: "file" },
    backupDest: "shell/.zshrc",
    sensitivity: "low",
  },

  // === Git ===
  {
    id: "git.config",
    name: ".gitconfig",
    paths: { darwin: "~/.gitconfig", linux: "~/.gitconfig" },
    category: "git",
    kind: { type: "file" },
    backupDest: "git/.gitconfig",
    sensitivity: "low",
  },
  {
    id: "git.ignore",
    name: ".gitignore_global",
    paths: { darwin: "~/.gitignore_global", linux: "~/.gitignore_global" },
    category: "git",
    kind: { type: "file" },
    backupDest: "git/.gitignore_global",
    sensitivity: "low",
  },
  {
    id: "gh.config",
    name: "GitHub CLI Config",
    paths: { darwin: "~/.config/gh/config.yml", linux: "~/.config/gh/config.yml" },
    category: "git",
    kind: { type: "file" },
    backupDest: "git/gh/config.yml",
    sensitivity: "low",
  },

  // === Editors ===
  {
    id: "editor.zed",
    name: "Zed Settings",
    paths: { darwin: "~/.config/zed/settings.json", linux: "~/.config/zed/settings.json" },
    category: "editor",
    kind: { type: "file" },
    backupDest: "editor/zed/settings.json",
    sensitivity: "low",
  },
  {
    id: "editor.cursor",
    name: "Cursor Settings",
    paths: {
      darwin: "~/Library/Application Support/Cursor/User/settings.json",
      linux: "~/.config/Cursor/User/settings.json",
    },
    category: "editor",
    kind: { type: "file" },
    backupDest: "editor/cursor/settings.json",
    sensitivity: "low",
  },
  {
    id: "editor.nvim",
    name: "Neovim Config",
    paths: { darwin: "~/.config/nvim/init.lua", linux: "~/.config/nvim/init.lua" },
    category: "editor",
    kind: { type: "file" },
    backupDest: "editor/nvim/init.lua",
    sensitivity: "low",
  },
  {
    id: "editor.vimrc",
    name: ".vimrc",
    paths: { darwin: "~/.vimrc", linux: "~/.vimrc" },
    category: "editor",
    kind: { type: "file" },
    backupDest: "editor/.vimrc",
    sensitivity: "low",
  },

  // === Terminal ===
  {
    id: "terminal.p10k",
    name: ".p10k.zsh",
    paths: { darwin: "~/.p10k.zsh", linux: "~/.p10k.zsh" },
    category: "terminal",
    kind: { type: "file", metadata: true },
    backupDest: "terminal/.p10k.zsh",
    sensitivity: "low",
  },
  {
    id: "terminal.tmux",
    name: ".tmux.conf",
    paths: { darwin: "~/.tmux.conf", linux: "~/.tmux.conf" },
    category: "terminal",
    kind: { type: "file" },
    backupDest: "terminal/.tmux.conf",
    sensitivity: "low",
  },

  // === SSH ===
  {
    id: "ssh.config",
    name: "SSH Config",
    paths: { darwin: "~/.ssh/config", linux: "~/.ssh/config" },
    category: "ssh",
    kind: { type: "file" },
    backupDest: "ssh/config",
    sensitivity: "medium",
    redact: redactSshConfig,
  },

  // === npm ===
  {
    id: "npm.config",
    name: ".npmrc",
    paths: { darwin: "~/.npmrc", linux: "~/.npmrc" },
    category: "npm",
    kind: { type: "file" },
    backupDest: "npm/.npmrc",
    sensitivity: "high",
    redact: redactNpmTokens,
  },

  // === Bun ===
  {
    id: "bun.config",
    name: ".bunfig.toml",
    paths: { darwin: "~/.bunfig.toml", linux: "~/.bunfig.toml" },
    category: "bun",
    kind: { type: "file" },
    backupDest: "bun/.bunfig.toml",
    sensitivity: "low",
  },
];
