export function getHome(): string {
  const home = Bun.env.HOME;
  if (!home) {
    console.error("Error: HOME environment variable is not set.");
    process.exit(1);
  }
  return home;
}
