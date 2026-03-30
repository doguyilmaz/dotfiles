import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import { join } from "path";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { collectClaude } from "../../src/collectors/claude";
import type { CollectorContext } from "../../src/collectors/types";

let tempHome: string;

beforeAll(async () => {
  tempHome = await mkdtemp(join(tmpdir(), "dotfiles-test-"));
  const claudeDir = join(tempHome, ".claude");
  await Bun.$`mkdir -p ${claudeDir}/skills`.quiet();
  await Bun.write(
    join(claudeDir, "settings.json"),
    JSON.stringify({
      permissions: { "Bash(git *)": "allow", "Read": "allow" },
    })
  );
  await Bun.write(join(claudeDir, "CLAUDE.md"), "# My instructions\nBe helpful.");
  await Bun.write(join(claudeDir, "skills/my-skill.md"), "skill content");
});

afterAll(async () => {
  await rm(tempHome, { recursive: true, force: true });
});

describe("collectClaude", () => {
  test("collects plugins from settings.json", async () => {
    const ctx: CollectorContext = { redact: true, home: tempHome };
    const result = await collectClaude(ctx);
    expect(result["ai.claude.plugins"]).toBeDefined();
    expect(result["ai.claude.plugins"].pairs["Bash(git *)"]).toBe("allow");
  });

  test("collects skills", async () => {
    const ctx: CollectorContext = { redact: true, home: tempHome };
    const result = await collectClaude(ctx);
    expect(result["ai.claude.skills"]).toBeDefined();
    expect(result["ai.claude.skills"].items.length).toBeGreaterThan(0);
  });

  test("collects CLAUDE.md as content", async () => {
    const ctx: CollectorContext = { redact: true, home: tempHome };
    const result = await collectClaude(ctx);
    expect(result["file:claude/CLAUDE.md"]).toBeDefined();
    expect(result["file:claude/CLAUDE.md"].content).toContain("Be helpful");
  });

  test("returns empty for missing directory", async () => {
    const ctx: CollectorContext = { redact: true, home: "/tmp/nonexistent" };
    const result = await collectClaude(ctx);
    expect(Object.keys(result)).toHaveLength(0);
  });
});
