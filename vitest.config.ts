import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["src/**/index.ts", "src/contracts/**"],
      include: ["src/**/*.{ts,tsx}"],
      provider: "v8",
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    environment: "jsdom",
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
    maxWorkers: 1,
    minWorkers: 1,
    pool: "forks"
  }
});
