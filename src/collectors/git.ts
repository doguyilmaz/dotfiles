import { join } from "path";
import type { Collector } from "./types";
import { makeSection } from "./types";

export const collectGit: Collector = async (ctx) => {
  const gitconfigFile = Bun.file(join(ctx.home, ".gitconfig"));

  if (!(await gitconfigFile.exists())) return {};

  const content = await gitconfigFile.text();
  return {
    "file:git/gitconfig": makeSection("file:git/gitconfig", {
      content: content.trim(),
    }),
  };
};
