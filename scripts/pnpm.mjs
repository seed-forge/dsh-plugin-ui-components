import { existsSync } from "node:fs";
import { delimiter, dirname, join } from "node:path";

function executableOnPath(name) {
  const directories = (process.env.Path ?? process.env.PATH ?? "")
    .split(delimiter)
    .map((directory) => directory.replace(/^"|"$/g, ""))
    .filter(Boolean);
  return directories.map((directory) => join(directory, name)).find(existsSync);
}

export function pnpmInvocation() {
  if (process.platform !== "win32") return { command: "pnpm", prefix: [] };

  const commandPath = executableOnPath("pnpm.cmd");
  if (!commandPath) throw new Error("pnpm.cmd was not found on PATH.");

  // Invoke pnpm's JavaScript entry directly: Node cannot spawn a .cmd shim without a shell.
  const pnpmScript = join(dirname(commandPath), "node_modules", "pnpm", "bin", "pnpm.cjs");
  if (!existsSync(pnpmScript)) throw new Error(`pnpm entry point was not found next to ${commandPath}.`);
  return { command: process.execPath, prefix: [pnpmScript] };
}
