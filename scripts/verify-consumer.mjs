import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

import { pnpmInvocation } from "./pnpm.mjs";

const packageRoot = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
const artifactDirectory = join(packageRoot, ".artifacts");

function run(command, args, cwd, capture = false) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", stdio: capture ? "pipe" : "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = [result.stderr, result.stdout].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} failed${detail ? `: ${detail}` : ""}`);
  }
  return result.stdout ?? "";
}

function runPnpm(args, cwd, capture = false) {
  const pnpm = pnpmInvocation();
  return run(pnpm.command, [...pnpm.prefix, ...args], cwd, capture);
}

function latestTarball() {
  if (!existsSync(artifactDirectory)) return undefined;
  return readdirSync(artifactDirectory)
    .filter((name) => name.endsWith(".tgz"))
    .sort()
    .at(-1);
}

try {
  if (!latestTarball()) runPnpm(["run", "pack:checked"], packageRoot);
  const tarballName = latestTarball();
  if (!tarballName) throw new Error("No package tarball was created.");
  const tarballPath = join(artifactDirectory, tarballName);
  const fixture = mkdtempSync(join(tmpdir(), "dsh-plugin-ui-components-consumer-"));

  try {
    const packageDefinition = {
      name: "dsh-plugin-ui-components-consumer-fixture",
      private: true,
      type: "module",
      dependencies: {
        [packageJson.name]: `file:${tarballPath}`,
        react: packageJson.devDependencies.react,
        "react-dom": packageJson.devDependencies["react-dom"]
      },
      devDependencies: {
        "@types/react": packageJson.devDependencies["@types/react"],
        "@types/react-dom": packageJson.devDependencies["@types/react-dom"],
        typescript: packageJson.devDependencies.typescript
      }
    };
    writeFileSync(join(fixture, "package.json"), `${JSON.stringify(packageDefinition, null, 2)}\n`);
    writeFileSync(join(fixture, "tsconfig.json"), JSON.stringify({
      compilerOptions: {
        jsx: "react-jsx",
        module: "ESNext",
        moduleResolution: "Bundler",
        noEmit: true,
        strict: true,
        target: "ES2022"
      },
      include: ["src"]
    }, null, 2));
    const sourceDirectory = join(fixture, "src");
    await import("node:fs/promises").then(({ mkdir }) => mkdir(sourceDirectory, { recursive: true }));
    writeFileSync(join(sourceDirectory, "index.tsx"), `
import { ArtifactCard, ComposerAction, PluginSurface, RunStatus, TabRegistry } from ${JSON.stringify(packageJson.name)};
import type { TabDescriptor } from ${JSON.stringify(`${packageJson.name}/registry`)};

const registry = new TabRegistry();
const tab: TabDescriptor = { id: "status", label: "Status", render: () => null };
registry.register(tab);

export const consumerView = (
  <PluginSurface label="Consumer fixture">
    <RunStatus value={{ status: "running" }} />
    <ComposerAction draft="status request" onDraft={() => undefined} />
    <ArtifactCard artifact={{ id: "artifact", kind: "link", label: "Artifact", safeUrl: "https://example.test/artifact" }} />
  </PluginSurface>
);
`);
    runPnpm(["install", "--ignore-scripts", "--strict-peer-dependencies"], fixture);
    runPnpm(["exec", "tsc", "--noEmit"], fixture);
    const commonJs = run("node", ["--input-type=commonjs", "-e", `const library = require(${JSON.stringify(packageJson.name)}); if (!library.PluginSurface || !library.TabRegistry) process.exit(1);`], fixture, true);
    if (commonJs.trim()) process.stdout.write(commonJs);
    console.log(`Consumer install and typecheck passed for ${packageJson.name}@${packageJson.version}.`);
  } finally {
    rmSync(fixture, { force: true, recursive: true });
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
