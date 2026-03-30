import { test, expect, describe } from "bun:test";

function fuzzyMatch(query: string, sectionName: string): boolean {
  const q = query.toLowerCase();
  const s = sectionName.toLowerCase();
  return s.includes(q) || s.split(".").some((part) => part.includes(q));
}

describe("fuzzyMatch", () => {
  test("matches exact section name", () => {
    expect(fuzzyMatch("meta", "meta")).toBe(true);
  });

  test("matches partial section name", () => {
    expect(fuzzyMatch("brew", "apps.brew.formulae")).toBe(true);
    expect(fuzzyMatch("brew", "apps.brew.casks")).toBe(true);
  });

  test("matches subsection", () => {
    expect(fuzzyMatch("models", "ai.ollama.models")).toBe(true);
  });

  test("matches partial subsection", () => {
    expect(fuzzyMatch("olla", "ai.ollama.models")).toBe(true);
  });

  test("does not match unrelated", () => {
    expect(fuzzyMatch("docker", "ai.ollama.models")).toBe(false);
  });

  test("case insensitive", () => {
    expect(fuzzyMatch("META", "meta")).toBe(true);
    expect(fuzzyMatch("Brew", "apps.brew.formulae")).toBe(true);
  });
});
