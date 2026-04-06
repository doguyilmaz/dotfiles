import { join } from "path";
import { redactSshConfig } from "../utils/redact";
import { redactNpmTokens } from "../utils/redact";
import type { BackupSource } from "./types";

export const backupSources: BackupSource[] = [
  {
    category: "ai",
    entries: (home) => [
      { type: "file", src: join(home, ".claude/settings.json"), dest: "ai/claude/settings.json" },
      { type: "file", src: join(home, ".claude/CLAUDE.md"), dest: "ai/claude/CLAUDE.md" },
      { type: "dir", src: join(home, ".claude/skills"), dest: "ai/claude/skills" },
      { type: "file", src: join(home, ".cursor/mcp.json"), dest: "ai/cursor/mcp.json" },
      { type: "dir", src: join(home, ".cursor/skills"), dest: "ai/cursor/skills" },
      { type: "file", src: join(home, ".gemini/settings.json"), dest: "ai/gemini/settings.json" },
      { type: "file", src: join(home, ".gemini/GEMINI.md"), dest: "ai/gemini/GEMINI.md" },
      { type: "dir", src: join(home, ".gemini/skills"), dest: "ai/gemini/skills" },
      { type: "file", src: join(home, ".codeium/windsurf/mcp_config.json"), dest: "ai/windsurf/mcp_config.json" },
      { type: "dir", src: join(home, ".codeium/windsurf/skills"), dest: "ai/windsurf/skills" },
    ],
  },
  {
    category: "shell",
    entries: (home) => [
      { type: "file", src: join(home, ".zshrc"), dest: "shell/.zshrc" },
    ],
  },
  {
    category: "git",
    entries: (home) => [
      { type: "file", src: join(home, ".gitconfig"), dest: "git/.gitconfig" },
      { type: "file", src: join(home, ".gitignore_global"), dest: "git/.gitignore_global" },
      { type: "file", src: join(home, ".config/gh/config.yml"), dest: "git/gh/config.yml" },
    ],
  },
  {
    category: "editor",
    entries: (home) => [
      { type: "file", src: join(home, ".config/zed/settings.json"), dest: "editor/zed/settings.json" },
      { type: "file", src: join(home, "Library/Application Support/Cursor/User/settings.json"), dest: "editor/cursor/settings.json" },
      { type: "file", src: join(home, ".config/nvim/init.lua"), dest: "editor/nvim/init.lua" },
      { type: "file", src: join(home, ".vimrc"), dest: "editor/.vimrc" },
    ],
  },
  {
    category: "terminal",
    entries: (home) => [
      { type: "file", src: join(home, ".p10k.zsh"), dest: "terminal/.p10k.zsh" },
      { type: "file", src: join(home, ".tmux.conf"), dest: "terminal/.tmux.conf" },
    ],
  },
  {
    category: "ssh",
    entries: (home) => [
      { type: "file", src: join(home, ".ssh/config"), dest: "ssh/config", redact: redactSshConfig },
    ],
  },
  {
    category: "npm",
    entries: (home) => [
      { type: "file", src: join(home, ".npmrc"), dest: "npm/.npmrc", redact: redactNpmTokens },
    ],
  },
  {
    category: "bun",
    entries: (home) => [
      { type: "file", src: join(home, ".bunfig.toml"), dest: "bun/.bunfig.toml" },
    ],
  },
];
