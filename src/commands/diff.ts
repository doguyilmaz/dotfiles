import { join } from "path";
import { readdir } from "fs/promises";
import { resolveOutputDir } from "../utils/resolve-output";
import { buildRestorePlan } from "../restore/plan";
import type { RestoreEntry, FileStatus } from "../restore/types";

function parseDiffArgs(args: string[]) {
  let section: string | null = null;
  let backupPath: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--section" && args[i + 1]) section = args[++i];
    else if (!args[i].startsWith("--")) backupPath = args[i];
  }

  return { section, backupPath };
}

async function findLatestBackup(): Promise<string | null> {
  const outputDir = await resolveOutputDir(null);
  let entries: string[];
  try {
    entries = await readdir(outputDir);
  } catch {
    return null;
  }

  const backups = entries
    .filter((e) => e.startsWith("backup-"))
    .sort()
    .reverse();

  return backups.length > 0 ? join(outputDir, backups[0]) : null;
}

const STATUS_COLORS: Record<FileStatus, string> = {
  conflict: "\x1b[33m",
  new: "\x1b[34m",
  same: "\x1b[32m",
  redacted: "\x1b[90m",
};
const RESET = "\x1b[0m";

const STATUS_LABELS: Record<FileStatus, string> = {
  conflict: "modified",
  new: "new on machine",
  same: "unchanged",
  redacted: "redacted",
};

function printDiffEntry(entry: RestoreEntry) {
  const color = STATUS_COLORS[entry.status];
  const label = STATUS_LABELS[entry.status];
  console.log(`${color}  ${entry.backupPath} — ${label}${RESET}`);
}

export async function diff(args: string[]) {
  const { section, backupPath } = parseDiffArgs(args);
  const home = Bun.env.HOME ?? "/tmp";

  const resolvedBackup = backupPath ?? (await findLatestBackup());
  if (!resolvedBackup) {
    console.log("No backup found. Run 'dotfiles backup' first.");
    return;
  }

  const plan = await buildRestorePlan(resolvedBackup, home);
  let entries = plan.entries;

  if (section) {
    entries = entries.filter((e) => e.category === section);
    if (entries.length === 0) {
      console.log(`No entries found for section: ${section}`);
      return;
    }
  }

  // Check for files on machine not in backup
  // (buildRestorePlan only finds files IN backup, "new on machine" requires reverse check)
  // For now, status meanings from backup perspective:
  //   same = unchanged, conflict = modified since backup, new = not on machine yet

  const grouped = new Map<string, RestoreEntry[]>();
  for (const entry of entries) {
    const cat = entry.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(entry);
  }

  console.log(`\nComparing backup against live system:\n`);

  for (const [category, catEntries] of grouped) {
    console.log(`  ${category}/`);
    for (const entry of catEntries) {
      printDiffEntry(entry);
    }
  }

  const modified = entries.filter((e) => e.status === "conflict").length;
  const unchanged = entries.filter((e) => e.status === "same").length;
  const newFiles = entries.filter((e) => e.status === "new").length;
  const redacted = entries.filter((e) => e.status === "redacted").length;

  const parts: string[] = [];
  if (modified > 0) parts.push(`\x1b[33m${modified} modified${RESET}`);
  if (unchanged > 0) parts.push(`\x1b[32m${unchanged} unchanged${RESET}`);
  if (newFiles > 0) parts.push(`\x1b[34m${newFiles} new${RESET}`);
  if (redacted > 0) parts.push(`\x1b[90m${redacted} redacted${RESET}`);

  console.log(`\n  ${entries.length} files: ${parts.join(", ")}`);
}
