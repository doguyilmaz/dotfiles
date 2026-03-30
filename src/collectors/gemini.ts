import { join } from "path";
import type { Collector } from "./types";
import { makeSection } from "./types";

export const collectGemini: Collector = async (ctx) => {
  const result: Record<string, ReturnType<typeof makeSection>> = {};
  const geminiDir = join(ctx.home, ".gemini");

  const settingsFile = Bun.file(join(geminiDir, "settings.json"));
  if (await settingsFile.exists()) {
    try {
      const settings = await settingsFile.json();
      const pairs: Record<string, string> = {};
      for (const [key, val] of Object.entries(settings)) {
        pairs[key] = typeof val === "object" ? JSON.stringify(val) : String(val);
      }
      if (Object.keys(pairs).length) {
        result["ai.gemini.settings"] = makeSection("ai.gemini.settings", { pairs });
      }
    } catch {}
  }

  try {
    const skillsDir = join(geminiDir, "skills");
    const glob = new Bun.Glob("*");
    const items: { raw: string; columns: string[] }[] = [];
    for await (const entry of glob.scan(skillsDir)) {
      items.push({ raw: entry, columns: [entry] });
    }
    if (items.length) {
      result["ai.gemini.skills"] = makeSection("ai.gemini.skills", { items });
    }
  } catch {}

  const geminiMdFile = Bun.file(join(geminiDir, "GEMINI.md"));
  if (await geminiMdFile.exists()) {
    const content = await geminiMdFile.text();
    result["file:gemini/GEMINI.md"] = makeSection("file:gemini/GEMINI.md", {
      content: content.trim(),
    });
  }

  return result;
};
