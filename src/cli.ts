import { collect } from "./commands/collect";
import { backup } from "./commands/backup";
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
  compare [file1] [file2]                            Diff two .dotf reports
  list <section>                                     Print a section from most recent report`);
}
