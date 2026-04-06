import { collect } from "./commands/collect";
import { backup } from "./commands/backup";
import { scan } from "./commands/scan";
import { restore } from "./commands/restore";
import { compareCli } from "./commands/compare";
import { list } from "./commands/list";

const [command, ...args] = Bun.argv.slice(2);

switch (command) {
  case "collect":
    await collect(args);
    break;
  case "backup":
    await backup(args);
    break;
  case "scan":
    await scan(args);
    break;
  case "restore":
    await restore(args);
    break;
  case "compare":
    await compareCli(args);
    break;
  case "list":
    await list(args);
    break;
  default:
    console.log(`Usage: dotfiles <command>

Commands:
  collect [--no-redact] [-o path]                    Collect machine config → .dotf report
  backup  [--no-redact] [-o path] [--only] [--skip]  Backup config files → structured directory
  scan    [path]                                     Scan files for sensitive data
  restore <path> [--pick] [--dry-run]                Restore config files from backup
  compare [file1] [file2]                            Diff two .dotf reports
  list <section>                                     Print a section from most recent report`);
}
