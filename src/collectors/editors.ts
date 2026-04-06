import { join } from "path";
import type { Collector } from "./types";
import { makeSection } from "./types";

export const collectEditors: Collector = async (ctx) => {
  const result: Record<string, ReturnType<typeof makeSection>> = {};

  const zedFile = Bun.file(join(ctx.home, ".config/zed/settings.json"));
  if (await zedFile.exists()) {
    const content = await zedFile.text();
    result["editor.zed"] = makeSection("editor.zed", { content: content.trim() });
  }

  const cursorSettingsFile = Bun.file(
    join(ctx.home, "Library/Application Support/Cursor/User/settings.json")
  );
  if (await cursorSettingsFile.exists()) {
    const content = await cursorSettingsFile.text();
    result["editor.cursor"] = makeSection("editor.cursor", { content: content.trim() });
  }

  return result;
};
