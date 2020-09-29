import fs from "fs";
import path from "path";

const matchIgnore = /^\./;

const markets = new Set([
  "Asia",
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "Demo",
  "Denmark",
  "Europe",
  "Finland",
  "France",
  "Germany",
  "Hong Kong",
  "Italy",
  "Japan",
  "Korea",
  "Korea",
  "Mexico",
  "Netherlands",
  "Portugal",
  "Russia",
  "Spain",
  "Spain",
  "Sweden",
  "Taiwan",
  "Unknown",
  "USA",
  "World",
]);

function process(romSet, inputDirname, outputDirname, flags) {
  for (const item of fs.readdirSync(inputDirname)) {
    if (matchIgnore.test(item)) {
      continue;
    }

    const pathname = path.join(inputDirname, item);

    if (fs.statSync(pathname).isDirectory()) {
      process(romSet, pathname, outputDirname, flags);
    } else {
      const matchParenthesis = /\(([^()]+)\)/g;

      let matches;
      let match;

      while ((matches = matchParenthesis.exec(item))) {
        const matched = matches[1];

        if (!matched) {
          continue;
        }

        const parts = matched.split(", ");

        if (parts.every((part) => markets.has(part))) {
          match = matched;
          break;
        }
      }

      if (match) {
        const nextOutputDirname = path.join(
          outputDirname,
          `${romSet} (${match})`
        );
        const newPathname = path.join(nextOutputDirname, item);

        if (flags.dryRun) {
          console.log("Rename", { pathname, newPathname });
        } else {
          fs.mkdirSync(nextOutputDirname, { recursive: true });
          fs.renameSync(pathname, newPathname);
        }
      } else {
        console.warn(item, "was not matched");
      }
    }
  }
}

export default (inputDirname, outputDirname, flags = {}) => {
  const romSet = path.basename(inputDirname);

  process(romSet, inputDirname, outputDirname, flags);
};
