# Contributing

## Development Setup

Use Node.js 22.19+ and pnpm 10+.

```bash
pnpm install --frozen-lockfile
pnpm run release:check
```

## Contribution Rules

- Keep the package a build-time library. Do not add DSH private DOM access,
  automatic slot registration, persistence, routing, or execution ownership.
- Preserve the distinction between draft injection and message submission.
  Components must not submit a DSH Composer message implicitly.
- Keep artifact previews fail-closed: callers must provide a non-empty HTTPS
  origin allowlist before a URL can render.
- Add or update tests for every public component, contract, or registry change.
- Run `pnpm run release:check` before opening a pull request.

## Pull Requests

Describe the plugin scenario that demonstrates shared value. Components with a
single domain-specific consumer should remain in that plugin until a second
independent use case proves a shared contract.
