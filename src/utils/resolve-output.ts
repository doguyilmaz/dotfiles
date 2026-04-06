import { join } from "path";

export async function resolveOutputDir(explicit: string | null): Promise<string> {
  if (explicit) return explicit;

  const cwd = process.cwd();
  const isRepo = await Bun.file(join(cwd, ".git/HEAD")).exists();

  if (isRepo) return join(cwd, "reports");

  const home = Bun.env.HOME ?? "/tmp";
  return join(home, "Downloads");
}
