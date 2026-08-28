import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const exampleRoot = resolve(import.meta.dirname, "..");
const packageDefinition = JSON.parse(readFileSync(resolve(exampleRoot, "package.json"), "utf8"));
const clientBundle = readFileSync(resolve(exampleRoot, "src", "client.js"), "utf8");

test("DSH can inspect the proof package and execute its browser bundle without a library-name require", () => {
  assert.equal(packageDefinition.exports["./package.json"], "./package.json");
  assert.equal(packageDefinition.exports["./client"], "./src/client.js");
  assert.match(clientBundle, /window\.__ModuleLoader__\.load/u);
  assert.match(clientBundle, /const foundationModule = \{ exports: \{\} \};/u);
  assert.doesNotMatch(clientBundle, /require\(["']@seed-forge\/dsh-plugin-ui-components["']\)/u);
  assert.doesNotMatch(clientBundle, /sourceMappingURL=/u);
  assert.doesNotMatch(clientBundle, /[\t ]+$/mu);
  assert.match(clientBundle, /conversation\.input\.left/u);
});
