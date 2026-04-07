import { getHome } from "../utils/home";
import { findLatestBackup } from "../utils/find-backup";
import { buildRestorePlan } from "../restore/plan";
import type { RestoreEntry, FileStatus } from "../restore/types";

function parseArgs(args: string[]) {
  let section: string | null = null;
  let backupPath: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--section" && args[i + 1]) section = args[++i];
    else if (!args[i].startsWith("--")) backupPath = args[i];
  }

  return { section, backupPath };
}

const isTTY = process.stdout.isTTY ?? false;

function color(name: string): string {
  if (!isTTY) return "";
  return Bun.color(name, "ansi-256") ?? "";
}

const STATUS_COLORS: Record<FileStatus, string> = {
  conflict: color("yellow"),
  new: color("blue"),
  same: color("green"),
  redacted: color("gray"),
};
const RESET = isTTY ? "\x1b[0m" : "";

const STATUS_LABELS: Record<FileStatus, string> = {
  conflict: "modified",
  new: "new in backup (missing on machine)",
  same: "unchanged",
  redacted: "redacted",
};

function printDiffEntry(entry: RestoreEntry) {
  const color = STATUS_COLORS[entry.status];
  const label = STATUS_LABELS[entry.status];
  console.log(`${color}  ${entry.backupPath} — ${label}${RESET}`);
}

export async function diff(args: string[]) {
  const { section, backupPath } = parseArgs(args);
  const home = getHome();

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
  if (modified > 0) parts.push(`${STATUS_COLORS.conflict}${modified} modified${RESET}`);
  if (unchanged > 0) parts.push(`${STATUS_COLORS.same}${unchanged} unchanged${RESET}`);
  if (newFiles > 0) parts.push(`${STATUS_COLORS.new}${newFiles} new${RESET}`);
  if (redacted > 0) parts.push(`${STATUS_COLORS.redacted}${redacted} redacted${RESET}`);

  console.log(`\n  ${entries.length} files: ${parts.join(", ")}`);
}
