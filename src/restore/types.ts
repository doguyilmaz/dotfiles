export type FileStatus = "new" | "conflict" | "same" | "redacted";

export interface RestoreEntry {
  backupPath: string;
  targetPath: string;
  category: string;
  status: FileStatus;
}

export interface RestorePlan {
  entries: RestoreEntry[];
  backupDir: string;
  categories: string[];
}

export type ConflictAction = "overwrite" | "skip" | "diff";
export type BatchConflictAction = ConflictAction | "overwrite-all" | "skip-all";
