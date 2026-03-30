import { join } from "path";
import type { Collector } from "./types";
import { makeSection } from "./types";

export const collectCursor: Collector = async (ctx) => {
  const result: Record<string, ReturnType<typeof makeSection>> = {};
  const cursorDir = join(ctx.home, ".cursor");

  const mcpFile = Bun.file(join(cursorDir, "mcp.json"));
  if (await mcpFile.exists()) {
    const content = await mcpFile.text();
    result["ai.cursor.mcp"] = makeSection("ai.cursor.mcp", {
      content: content.trim(),
    });
  }

  try {
    const skillsDir = join(cursorDir, "skills");
    const glob = new Bun.Glob("*");
    const items: { raw: string; columns: string[] }[] = [];
    for await (const entry of glob.scan(skillsDir)) {
      items.push({ raw: entry, columns: [entry] });
    }
    if (items.length) {
      result["ai.cursor.skills"] = makeSection("ai.cursor.skills", { items });
    }
  } catch {}

  return result;
};
