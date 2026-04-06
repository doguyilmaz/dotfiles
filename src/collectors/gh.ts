import { join } from "path";
import type { Collector, CollectorResult } from "./types";
import { makeSection } from "./types";

export const collectGh: Collector = async (ctx) => {
  const configFile = Bun.file(join(ctx.home, ".config/gh/config.yml"));
  if (!(await configFile.exists())) return {} as CollectorResult;

  const content = await configFile.text();
  return {
    "gh.config": makeSection("gh.config", { content: content.trim() }),
  };
};
