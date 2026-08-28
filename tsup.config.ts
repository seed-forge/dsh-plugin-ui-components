import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    "contracts/index": "src/contracts/index.ts",
    "registry/index": "src/registry/index.ts",
    "tokens/index": "src/tokens/index.ts",
    styles: "src/styles.ts"
  },
  external: ["react", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"],
  format: ["esm", "cjs"],
  platform: "browser",
  sourcemap: true,
  splitting: false,
  treeshake: true
});
