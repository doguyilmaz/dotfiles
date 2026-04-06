import type { Collector } from "./types";
import { makeSection } from "./types";

export const collectHomebrew: Collector = async () => {
  if (process.platform !== "darwin") return {};

  const result: Record<string, ReturnType<typeof makeSection>> = {};

  try {
    const formulaeOutput = await Bun.$`brew list --formula`.text();
    const formulae = formulaeOutput
      .trim()
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean)
      .sort();

    if (formulae.length) {
      result["apps.brew.formulae"] = makeSection("apps.brew.formulae", {
        items: formulae.map((f) => ({ raw: f, columns: [f] })),
      });
    }
  } catch {}

  try {
    const casksOutput = await Bun.$`brew list --cask`.text();
    const casks = casksOutput
      .trim()
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean)
      .sort();

    if (casks.length) {
      result["apps.brew.casks"] = makeSection("apps.brew.casks", {
        items: casks.map((c) => ({ raw: c, columns: [c] })),
      });
    }
  } catch {}

  return result;
};
