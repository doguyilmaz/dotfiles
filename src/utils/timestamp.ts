export function generateTimestamp(date: Date = new Date()): string {
  return date.toISOString().replace(/[-:T]/g, "").slice(0, 14);
}
