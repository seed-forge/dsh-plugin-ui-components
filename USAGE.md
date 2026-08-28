# Usage

This package is a build-time dependency for a DSH Web plugin. It must not be
installed through `dsh plugin add` and it does not mount itself into DSH.

## Local Development

From a consuming plugin checked out beside this repository:

```bash
pnpm add --save-exact ../dsh-plugin-ui-components
pnpm run build
```

Import only the entry points needed by the plugin:

```tsx
import { ComposerAction, RunStatus } from "@seed-forge/dsh-plugin-ui-components";
import { TabRegistry } from "@seed-forge/dsh-plugin-ui-components/registry";
```

The consuming bundle owns DSH slot registration and must materialize the
library into its browser client during its own build. Draft injection and
message submission remain separate consumer actions.

## Verification

```bash
pnpm install --frozen-lockfile
pnpm run release:check
```

## 可直接复制的中文 Prompt

```text
在当前 DSH Web 插件中以普通 npm 构建依赖接入 @seed-forge/dsh-plugin-ui-components。保持 DSH slot 注册、领域状态和执行逻辑在消费插件内；ComposerAction 只能注入草稿，未经明确动作不得自动发送消息。为 ArtifactCard 和 SafePreview 提供非空 HTTPS origin allowlist，并在构建期将组件库物化进 DSH 浏览器 client。
```
