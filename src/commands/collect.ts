import { hostname } from "os";
import { join } from "path";
import { stringify } from "@dotformat/core";
import type { DotfDocument } from "@dotformat/core";
import type { CollectorContext, CollectorResult } from "../collectors/types";
import { resolveOutputDir } from "../utils/resolve-output";
import { scanContent, summarize, formatReport } from "../scan";
import type { ScanResult } from "../scan";
import { collectMeta } from "../collectors/meta";
import { collectClaude } from "../collectors/claude";
import { collectCursor } from "../collectors/cursor";
import { collectGemini } from "../collectors/gemini";
import { collectWindsurf } from "../collectors/windsurf";
import { collectOllama } from "../collectors/ollama";
import { collectShell } from "../collectors/shell";
import { collectGit } from "../collectors/git";
import { collectGh } from "../collectors/gh";
import { collectEditors } from "../collectors/editors";
import { collectTerminal } from "../collectors/terminal";
import { collectSsh } from "../collectors/ssh";
import { collectNpm } from "../collectors/npm";
import { collectBunConfig } from "../collectors/bun-config";
import { collectApps } from "../collectors/apps";
import { collectHomebrew } from "../collectors/homebrew";

const collectors = [
  collectMeta,
  collectClaude,
  collectCursor,
  collectGemini,
  collectWindsurf,
  collectOllama,
  collectShell,
  collectGit,
  collectGh,
  collectEditors,
  collectTerminal,
  collectSsh,
  collectNpm,
  collectBunConfig,
  collectApps,
  collectHomebrew,
];

function parseArgs(args: string[]) {
  let redact = true;
  let outputDir: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--no-redact") redact = false;
    if (args[i] === "-o" && args[i + 1]) outputDir = args[++i];
  }

  return { redact, outputDir };
}

export async function collect(args: string[]) {
  const { redact, outputDir } = parseArgs(args);
  const resolvedOutput = await resolveOutputDir(outputDir);

  await Bun.$`mkdir -p ${resolvedOutput}`.quiet();

  const ctx: CollectorContext = {
    redact,
    home: Bun.env.HOME ?? "/tmp",
  };

  const sections: CollectorResult = {};

  for (const collector of collectors) {
    const result = await collector(ctx);
    Object.assign(sections, result);
  }

  const scanResults: ScanResult[] = [];
  if (redact) {
    for (const [name, section] of Object.entries(sections)) {
      if (section.content) {
        const result = scanContent(name, section.content);
        scanResults.push(result);
        if (result.action === "skip") {
          delete sections[name];
        }
      }
    }
  }

  const doc: DotfDocument = { sections };
  const output = stringify(doc);

  const now = new Date();
  const ts = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const filename = `${hostname()}-${ts}.dotf`;
  const filepath = join(resolvedOutput, filename);
  await Bun.write(filepath, output);

  console.log(`Report saved to: ${filepath}`);

  if (redact) {
    const summary = summarize(scanResults);
    const report = formatReport(summary);
    if (report) console.log(report);
  }
}
