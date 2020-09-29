import nis from "./nis.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";

const argv = yargs(hideBin(process.argv)).argv;

if (!argv.i || !argv.o) {
  throw "Missing required input";
}

nis(path.resolve(process.cwd(), argv.i), path.resolve(process.cwd(), argv.o), {
  dryRun: !!argv.d,
});
