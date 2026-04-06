import type { Collector, CollectorResult } from "./types";
import { makeSection } from "./types";

export const collectOllama: Collector = async () => {
  try {
    const output = await Bun.$`ollama list`.text();
    const lines = output.trim().split("\n");

    if (lines.length <= 1) return {} as CollectorResult;

    const items = lines.slice(1).map((line) => {
      const parts = line.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
      const [name, id, size, modified] = parts;
      const raw = [name, size, modified].filter(Boolean).join(" | ");
      return { raw, columns: [name, size, modified].filter(Boolean) };
    }).filter((item) => item.columns.length > 0);

    if (!items.length) return {} as CollectorResult;

    return {
      "ai.ollama.models": makeSection("ai.ollama.models", { items }),
    };
  } catch {
    return {} as CollectorResult;
  }
};
