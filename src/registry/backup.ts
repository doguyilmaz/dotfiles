import type { ConfigEntry, Platform } from "./types";
import type { BackupSource, BackupEntry } from "../backup/types";

export function registryBackupSources(entries: ConfigEntry[]): BackupSource[] {
  const platform = process.platform as Platform;
  const grouped = new Map<string, ConfigEntry[]>();

  for (const entry of entries) {
    if (!entry.paths[platform]) continue;
    if (!grouped.has(entry.category)) grouped.set(entry.category, []);
    grouped.get(entry.category)!.push(entry);
  }

  const sources: BackupSource[] = [];

  for (const [category, categoryEntries] of grouped) {
    sources.push({
      category,
      entries: (home: string) => {
        const backupEntries: BackupEntry[] = [];
        for (const entry of categoryEntries) {
          const template = entry.paths[platform]!;
          const src = template.replace("~", home);

          if (entry.kind.type === "dir") {
            backupEntries.push({ type: "dir", src, dest: entry.backupDest });
          } else {
            backupEntries.push({
              type: "file",
              src,
              dest: entry.backupDest,
              ...(entry.redact ? { redact: entry.redact } : {}),
            });
          }
        }
        return backupEntries;
      },
    });
  }

  return sources;
}
