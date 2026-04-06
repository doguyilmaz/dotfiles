export type Platform = "darwin" | "linux" | "win32";

export type EntryKind =
  | { type: "file" }
  | { type: "file"; metadata: true }
  | { type: "dir" }
  | { type: "json-extract"; fields: string[] };

export interface ConfigEntry {
  id: string;
  name: string;
  paths: Partial<Record<Platform, string>>;
  category: string;
  kind: EntryKind;
  backupDest: string;
  sensitivity: "low" | "medium" | "high";
  redact?: (content: string) => string;
}
