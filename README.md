# DSH Plugin UI Components

[中文说明](./README.zh-CN.md)

Host-aware React compound components and contracts for DeepSeek Harness (DSH)
Web plugins. The package focuses on the interaction boundaries that recur across
plugins: bounded plugin surfaces, agent run state, approval gates, artifact
previews, and workbench registries.

It is a build-time dependency, not a mountable DSH bundle. A consuming plugin
owns DSH slot registration, domain state, external actions, and browser bundle
generation.

## What It Provides

- Host-aware layout: `PluginSurface`, `PanelShell`, `Dock`, `Drawer`,
  `ScrollRegion`, and `Toolbar`.
- Agent-state UI: `AsyncState`, `RunStatus`, `OutputTail`, `StepTimeline`,
  `ApprovalGate`, and `ComposerAction`.
- Artifact safety: `ArtifactCard` and `SafePreview` render URLs only when the
  consumer supplies an explicit HTTPS origin allowlist.
- Extensibility contracts: `TabRegistry` and `ViewerRegistry` provide stable
  IDs, ordering, enabled gating, duplicate handling, and disposal.
- DSH-compatible styling: semantic `--dsw-*` token fallbacks and optional
  adapters for official DSH UI primitives.

## Boundaries

The library deliberately does not provide a complete workbench shell, private
DSH DOM access, DSH slot mounting, persistence, routing, or execution control.
`ComposerAction` injects a draft through a consumer callback; it does not send a
message automatically.

## Development

Requirements: Node.js 22.19+ and pnpm 10+.

```bash
pnpm install --frozen-lockfile
pnpm run release:check
```

The release check runs TypeScript validation, unit tests, the self-contained
DSH proof-bundle contract, a package tarball check, and a clean consumer
typecheck.

## Local Consumption

Public npm publishing is not enabled yet. To evaluate a checked-out copy in a
plugin project, build this package and reference the local directory during
development:

```bash
pnpm run build
pnpm add --save-exact ../dsh-plugin-ui-components
```

For a stable integration, pin a reviewed Git commit or published package version
once an official distribution channel is announced.

## Usage

```tsx
import { ComposerAction, PluginSurface, RunStatus } from "@seed-forge/dsh-plugin-ui-components";

export function StatusPanel() {
  return (
    <PluginSurface label="Run status">
      <RunStatus value={{ status: "running" }} />
      <ComposerAction draft="Show the current run status" onDraft={(draft) => setDraft(draft)} />
    </PluginSurface>
  );
}
```

The consuming DSH bundle is responsible for defining `setDraft`, registering the
panel through public DSH APIs, and materializing this dependency into its browser
client at build time. See [`examples/dsh-status-dock`](./examples/dsh-status-dock)
for a minimal proof-bundle fixture.

## Security

Do not pass arbitrary URLs to artifact components. `SafePreview` and
`ArtifactCard` fail closed unless a non-empty allowlist of HTTPS origins is
provided by the consumer. See [SECURITY.md](./SECURITY.md) for reporting
guidance.

## License

[MIT](./LICENSE)
