export type Severity = "HIGH" | "MEDIUM" | "LOW";
export type Action = "redact" | "skip" | "include";

export interface ScanPattern {
  id: string;
  label: string;
  severity: Severity;
  regex: RegExp;
  defaultAction: Action;
}

export interface ScanFinding {
  pattern: ScanPattern;
  line: number;
  match: string;
}

export interface ScanResult {
  filePath: string;
  findings: ScanFinding[];
  action: Action;
}

export interface ScanSummary {
  results: ScanResult[];
  redacted: number;
  skipped: number;
  included: number;
}
