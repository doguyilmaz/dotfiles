import { join } from "path";
import type { Collector, CollectorResult } from "./types";
import { makeSection } from "./types";

export const collectGit: Collector = async (ctx) => {
  const gitconfigFile = Bun.file(join(ctx.home, ".gitconfig"));
  if (!(await gitconfigFile.exists())) return {} as CollectorResult;

  const content = await gitconfigFile.text();
  return {
    "git.config": makeSection("git.config", { content: content.trim() }),
  };
};
