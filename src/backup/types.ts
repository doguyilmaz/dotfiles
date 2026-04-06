export interface BackupFile {
  type: "file";
  src: string;
  dest: string;
  redact?: (content: string) => string;
}

export interface BackupDir {
  type: "dir";
  src: string;
  dest: string;
}

export type BackupEntry = BackupFile | BackupDir;

export interface BackupSource {
  category: string;
  entries: (home: string) => BackupEntry[];
}
