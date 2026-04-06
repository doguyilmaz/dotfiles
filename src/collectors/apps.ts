import type { Collector } from "./types";
import { makeSection } from "./types";

export const collectApps: Collector = async () => {
  if (process.platform !== "darwin") return {};

  const result: Record<string, ReturnType<typeof makeSection>> = {};

  const raycastInstalled = await Bun.file("/Applications/Raycast.app/Contents/Info.plist").exists();
  result["apps.raycast"] = makeSection("apps.raycast", {
    pairs: { installed: raycastInstalled ? "true" : "false" },
  });

  const alttabInstalled = await Bun.file("/Applications/AltTab.app/Contents/Info.plist").exists();
  const alttabPairs: Record<string, string> = {
    installed: alttabInstalled ? "true" : "false",
  };

  if (alttabInstalled) {
    try {
      const prefs = await Bun.$`defaults read com.lwouis.alt-tab-macos 2>/dev/null`.text();
      if (prefs.trim()) alttabPairs.preferences = "exists";
    } catch {}
  }

  result["apps.alttab"] = makeSection("apps.alttab", { pairs: alttabPairs });

  try {
    const appsOutput = await Bun.$`ls /Applications/`.text();
    const apps = appsOutput
      .trim()
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean)
      .sort();

    if (apps.length) {
      result["apps.macos"] = makeSection("apps.macos", {
        items: apps.map((a) => ({ raw: a, columns: [a] })),
      });
    }
  } catch {}

  return result;
};
