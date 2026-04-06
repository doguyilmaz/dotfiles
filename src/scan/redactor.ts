import type { ScanResult } from "./types";

export function applyRedactions(content: string, result: ScanResult): string {
  if (result.action !== "redact") return content;

  let redacted = content;
  for (const finding of result.findings) {
    if (finding.pattern.defaultAction === "redact") {
      redacted = redacted.replace(finding.pattern.regex, "[REDACTED]");
    }
  }
  return redacted;
}
