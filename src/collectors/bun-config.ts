import { join } from "path";
import type { Collector, CollectorResult } from "./types";
import { makeSection } from "./types";

export const collectBunConfig: Collector = async (ctx) => {
  const bunfigFile = Bun.file(join(ctx.home, ".bunfig.toml"));
  if (!(await bunfigFile.exists())) return {} as CollectorResult;

  const content = await bunfigFile.text();
  return {
    "bun.config": makeSection("bun.config", { content: content.trim() }),
  };
};
