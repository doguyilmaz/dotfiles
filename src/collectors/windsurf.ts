import { join } from "path";
import type { Collector } from "./types";
import { makeSection } from "./types";

export const collectWindsurf: Collector = async (ctx) => {
  const result: Record<string, ReturnType<typeof makeSection>> = {};
  const windsurfDir = join(ctx.home, ".codeium/windsurf");

  const mcpFile = Bun.file(join(windsurfDir, "mcp_config.json"));
  if (await mcpFile.exists()) {
    const content = await mcpFile.text();
    result["ai.windsurf.mcp"] = makeSection("ai.windsurf.mcp", {
      content: content.trim(),
    });
  }

  try {
    const skillsDir = join(windsurfDir, "skills");
    const glob = new Bun.Glob("*");
    const items: { raw: string; columns: string[] }[] = [];
    for await (const entry of glob.scan(skillsDir)) {
      items.push({ raw: entry, columns: [entry] });
    }
    if (items.length) {
      result["ai.windsurf.skills"] = makeSection("ai.windsurf.skills", { items });
    }
  } catch {}

  return result;
};
