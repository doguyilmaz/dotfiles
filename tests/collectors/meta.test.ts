import { test, expect, describe } from "bun:test";
import { collectMeta } from "../../src/collectors/meta";
import type { CollectorContext } from "../../src/collectors/types";

const ctx: CollectorContext = { redact: true, home: "/tmp/test-home" };

describe("collectMeta", () => {
  test("returns meta section with host, os, date", async () => {
    const result = await collectMeta(ctx);
    expect(result.meta).toBeDefined();
    expect(result.meta.name).toBe("meta");
    expect(result.meta.pairs.host).toBeTruthy();
    expect(result.meta.pairs.os).toBeTruthy();
    expect(result.meta.pairs.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
