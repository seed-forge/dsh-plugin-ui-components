import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const packageRoot = resolve(import.meta.dirname, "..");
const distClient = resolve(packageRoot, "dist", "index.cjs");
const templatePath = resolve(packageRoot, "examples", "dsh-status-dock", "src", "client.template.js");
const outputPath = resolve(packageRoot, "examples", "dsh-status-dock", "src", "client.js");
const marker = "/* __DSH_FOUNDATION_CJS__ */";
const check = process.argv.includes("--check");

function indent(source, prefix) {
  return source.split("\n").map((line) => `${prefix}${line}`).join("\n");
}

function trimTrailingWhitespace(source) {
  return source.replace(/[ \t]+$/gmu, "");
}

function fail(message) {
  throw new Error(`dsh proof client: ${message}`);
}

try {
  if (!existsSync(distClient)) fail("dist/index.cjs is missing; run the package build first.");

  const template = readFileSync(templatePath, "utf8");
  const markerCount = template.split(marker).length - 1;
  if (markerCount !== 1) fail(`expected one ${marker} marker, found ${markerCount}.`);

  const foundationCjs = readFileSync(distClient, "utf8")
    .replace(/^\s*\/\/# sourceMappingURL=.*$/gmu, "")
    .trimEnd();
  if (foundationCjs.includes("@seed-forge/dsh-plugin-ui-components")) {
    fail("the Foundation browser proof must inline the package CJS bundle, not require the package by name.");
  }

  const foundationModule = [
    "  const foundationModule = { exports: {} };",
    "  ((module, exports, require) => {",
    indent(foundationCjs, "    "),
    "  })(foundationModule, foundationModule.exports, require);"
  ].join("\n");
  const generated = trimTrailingWhitespace(template.replace(marker, foundationModule));

  if (check) {
    if (!existsSync(outputPath) || readFileSync(outputPath, "utf8") !== generated) {
      fail("generated src/client.js is stale; run pnpm run build:dsh-proof.");
    }
    console.log("DSH proof client is current.");
  } else {
    writeFileSync(outputPath, generated);
    console.log(`Generated ${outputPath}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
