import { join } from "path";
import type { Collector, CollectorResult } from "./types";
import { makeSection } from "./types";
import { redactNpmTokens } from "../utils/redact";

export const collectNpm: Collector = async (ctx) => {
  const npmrcPath = join(ctx.home, ".npmrc");
  const file = Bun.file(npmrcPath);

  if (!(await file.exists())) return {} as CollectorResult;

  let content = await file.text();
  if (ctx.redact) content = redactNpmTokens(content);

  return {
    "npm.config": makeSection("npm.config", { content: content.trim() }),
  };
};
