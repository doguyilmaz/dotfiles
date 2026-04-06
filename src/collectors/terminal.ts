import { join } from "path";
import type { Collector, CollectorResult } from "./types";
import { makeSection } from "./types";

export const collectTerminal: Collector = async (ctx) => {
  const p10kFile = Bun.file(join(ctx.home, ".p10k.zsh"));
  if (!(await p10kFile.exists())) return {} as CollectorResult;

  const content = await p10kFile.text();
  const lineCount = content.split("\n").length;

  return {
    "terminal.p10k": makeSection("terminal.p10k", {
      pairs: { exists: "true", lines: String(lineCount) },
    }),
  };
};
