# DSH Status Dock Proof

This is a deliberately small DSH bundle that consumes
`@seed-forge/dsh-plugin-ui-components`. It validates the library in a real DSH
Web host without turning the library itself into a runtime bundle.

The Header action opens a bounded dock above the native Composer. Its only
Composer integration is draft injection. Approval records are still drafts and
do not represent an executor result.

```powershell
pnpm install
pnpm test
dsh plugin --profile web add .
```
