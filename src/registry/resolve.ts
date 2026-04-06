import type { ConfigEntry, Platform } from "./types";

export function resolvePath(entry: ConfigEntry, home: string): string | null {
  const platform = process.platform as Platform;
  const template = entry.paths[platform];
  if (!template) return null;
  return template
    .replace("~", home)
    .replace("%APPDATA%", Bun.env.APPDATA ?? "")
    .replace("%USERPROFILE%", Bun.env.USERPROFILE ?? home);
}

export function getEntriesForPlatform(entries: ConfigEntry[]): ConfigEntry[] {
  const platform = process.platform as Platform;
  return entries.filter((e) => e.paths[platform] !== undefined);
}
