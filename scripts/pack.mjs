import { existsSync, mkdirSync, rmSync } from "node:fs";
import { basename, resolve } from "node:path";
import { spawnSync } from "node:child_process";

import { pnpmInvocation } from "./pnpm.mjs";

const packageRoot = resolve(import.meta.dirname, "..");
const artifactDirectory = resolve(packageRoot, ".artifacts");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: packageRoot,
    encoding: "utf8",
    stdio: "inherit",
    ...options
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed with exit ${result.status ?? "unknown"}.`);
}

try {
  const pnpm = pnpmInvocation();
  if (existsSync(artifactDirectory)) rmSync(artifactDirectory, { force: true, recursive: true });
  mkdirSync(artifactDirectory, { recursive: true });
  run(pnpm.command, [...pnpm.prefix, "run", "build"]);
  run(pnpm.command, [...pnpm.prefix, "pack", "--pack-destination", artifactDirectory]);

  console.log(`Packed ${basename(packageRoot)} into ${artifactDirectory}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
