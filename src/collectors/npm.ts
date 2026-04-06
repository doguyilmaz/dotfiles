import { join } from "path";
import type { Collector, CollectorResult } from "./types";
import { makeSection } from "./types";
import { redactNpmTokens } from "../utils/redact";

export const collectNpm: Collector = async (ctx) => {
  const npmrcFile = Bun.file(join(ctx.home, ".npmrc"));
  if (!(await npmrcFile.exists())) return {} as CollectorResult;

  let content = await npmrcFile.text();
  if (ctx.redact) content = redactNpmTokens(content);

  return {
    "npm.config": makeSection("npm.config", { content: content.trim() }),
  };
};
