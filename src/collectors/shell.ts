import { join } from "path";
import type { Collector, CollectorResult } from "./types";
import { makeSection } from "./types";

export const collectShell: Collector = async (ctx) => {
  const zshrcFile = Bun.file(join(ctx.home, ".zshrc"));
  if (!(await zshrcFile.exists())) return {} as CollectorResult;

  const content = await zshrcFile.text();
  return {
    "shell.zshrc": makeSection("shell.zshrc", { content: content.trim() }),
  };
};
