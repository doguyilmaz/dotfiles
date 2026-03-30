import { join } from "path";
import type { Collector } from "./types";
import { makeSection } from "./types";

export const collectShell: Collector = async (ctx) => {
  const zshrcFile = Bun.file(join(ctx.home, ".zshrc"));

  if (!(await zshrcFile.exists())) return {};

  const content = await zshrcFile.text();
  return {
    "file:shell/zshrc": makeSection("file:shell/zshrc", {
      content: content.trim(),
    }),
  };
};
