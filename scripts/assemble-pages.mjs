import { cp, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(repositoryRoot, process.argv[2] ?? "_site");
const outputName = basename(outputRoot);

if (dirname(outputRoot) !== repositoryRoot || !outputName.startsWith("_site")) {
  throw new Error("The Pages output must be a direct _site* child of the repository root.");
}

const excludedNames = new Set([
  "node_modules",
  ".DS_Store",
  ".git",
  ".github",
  ".vscode",
  "tmp",
]);
const shouldCopy = (source) => {
  const name = basename(source);
  return !excludedNames.has(name) && name !== ".env" && !name.startsWith(".env.");
};

const copyDirectory = async (source, destination) => {
  await cp(source, destination, {
    recursive: true,
    filter: shouldCopy,
    preserveTimestamps: true,
  });
};

await rm(outputRoot, { recursive: true, force: true });
await Promise.all(
  ["about-me", "company-profile"].map((projectRoute) =>
    mkdir(join(outputRoot, "Projects", projectRoute), { recursive: true }),
  ),
);

await Promise.all(
  ["index.html", "style.css", "script.js"].map((file) =>
    cp(join(repositoryRoot, file), join(outputRoot, file)),
  ),
);

const publishedModuleDirectories = [
  "Module-02-02/Exercise-01",
  "Module-02-02/Exercise-02",
  "Module-02-03/Exercise-01-Profile-Page/dist",
  "Module-02-04/Exercise-01-Todo-List/dist",
  "Module-02-05/Exercise-01-Todo-List/dist",
  "Module-02-06/Exercise-01-Todo-List-Improved/dist",
  "Module-02-07/Exercise-02-Todo-List-with-Login/dist",
  "Module-02-08/Exercise-01-Todo-List-with-Backendless/dist",
];

for (const publishedDirectory of publishedModuleDirectories) {
  await copyDirectory(
    join(repositoryRoot, publishedDirectory),
    join(outputRoot, publishedDirectory),
  );
}

await copyDirectory(
  join(repositoryRoot, "Projects", "About Me"),
  join(outputRoot, "Projects", "about-me"),
);
await copyDirectory(
  join(repositoryRoot, "Projects", "Eventure Profile"),
  join(outputRoot, "Projects", "company-profile"),
);
await writeFile(join(outputRoot, ".nojekyll"), "");

let fileCount = 0;
let totalBytes = 0;

const inspectOutput = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);

    if (excludedNames.has(entry.name) || entry.name === ".env" || entry.name.startsWith(".env.")) {
      throw new Error(`Excluded deployment entry found: ${entryPath}`);
    }

    if (entry.isDirectory()) {
      await inspectOutput(entryPath);
      continue;
    }

    if (entry.isSymbolicLink()) {
      throw new Error(`Symbolic links are not allowed in the Pages artifact: ${entryPath}`);
    }

    fileCount += 1;
    totalBytes += (await stat(entryPath)).size;
  }
};

await inspectOutput(outputRoot);

console.log(
  `Prepared ${fileCount} public files (${(totalBytes / 1024 / 1024).toFixed(1)} MiB) in ${outputName}.`,
);
