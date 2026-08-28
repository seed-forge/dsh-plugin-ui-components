# Example

`examples/dsh-status-dock` is a minimal DSH Web proof bundle. It imports the
library at build time, inlines the built CJS output into its browser client, and
opens a bounded status dock above the native Composer.

```bash
pnpm install --frozen-lockfile
pnpm run build:dsh-proof
pnpm run check:dsh-proof
```

The fixture demonstrates `PluginSurface`, `RunStatus`, `OutputTail`,
`StepTimeline`, `ApprovalGate`, `ComposerAction`, `ArtifactCard`, and the
registry contracts. It deliberately treats approval and Composer interaction as
draft-only UI state; it does not claim an external executor has run.

The DSH-specific package metadata and manual host steps are documented in
[`examples/dsh-status-dock/README.md`](./examples/dsh-status-dock/README.md).
