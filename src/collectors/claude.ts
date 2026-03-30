import { join } from "path";
import type { Collector } from "./types";
import { makeSection } from "./types";

export const collectClaude: Collector = async (ctx) => {
  const result: Record<string, ReturnType<typeof makeSection>> = {};
  const claudeDir = join(ctx.home, ".claude");

  const settingsFile = Bun.file(join(claudeDir, "settings.json"));
  if (await settingsFile.exists()) {
    try {
      const settings = await settingsFile.json();
      const pairs: Record<string, string> = {};
      if (settings.permissions) {
        for (const [key, val] of Object.entries(settings.permissions)) {
          pairs[key] = String(val);
        }
      }
      if (Object.keys(pairs).length) {
        result["ai.claude.plugins"] = makeSection("ai.claude.plugins", { pairs });
      }
    } catch {}
  }

  try {
    const skillsDir = join(claudeDir, "skills");
    const glob = new Bun.Glob("*");
    const items: { raw: string; columns: string[] }[] = [];
    for await (const entry of glob.scan(skillsDir)) {
      items.push({ raw: entry, columns: [entry] });
    }
    if (items.length) {
      result["ai.claude.skills"] = makeSection("ai.claude.skills", { items });
    }
  } catch {}

  const claudeMdFile = Bun.file(join(claudeDir, "CLAUDE.md"));
  if (await claudeMdFile.exists()) {
    const content = await claudeMdFile.text();
    result["file:claude/CLAUDE.md"] = makeSection("file:claude/CLAUDE.md", {
      content: content.trim(),
    });
  }

  return result;
};
