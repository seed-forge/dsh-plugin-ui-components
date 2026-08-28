# DSH Plugin UI Components

[English README](./README.md)

面向 DeepSeek Harness（DSH）Web 插件的宿主感知 React 复合组件与契约。它聚焦多个插件都会重复遇到的交互边界：受限插件面板、Agent 运行状态、人工审批、产物预览与工作台注册表。

它是构建期依赖，不是可直接挂载的 DSH bundle。消费插件仍然负责 DSH slot 注册、领域状态、外部动作和浏览器 bundle 生成。

## 提供能力

- 宿主感知布局：`PluginSurface`、`PanelShell`、`Dock`、`Drawer`、`ScrollRegion`、`Toolbar`。
- Agent 状态：`AsyncState`、`RunStatus`、`OutputTail`、`StepTimeline`、`ApprovalGate`、`ComposerAction`。
- 产物安全：`ArtifactCard` 与 `SafePreview` 只有在消费方传入明确的 HTTPS origin allowlist 时才渲染 URL。
- 可扩展契约：`TabRegistry` 与 `ViewerRegistry` 提供稳定 ID、排序、启用判断、重复处理和释放机制。
- DSH 兼容样式：语义化 `--dsw-*` token fallback，以及对官方 DSH UI primitives 的可选适配。

## 边界

本库不会提供完整工作台壳、私有 DSH DOM 访问、DSH slot 挂载、持久化、路由或执行控制。`ComposerAction` 只通过消费方回调注入草稿，默认不会自动发送消息。

## 开发

要求：Node.js 22.19+ 与 pnpm 10+。

```bash
pnpm install --frozen-lockfile
pnpm run release:check
```

该检查会执行 TypeScript 校验、单元测试、自包含 DSH proof bundle 契约、包 tarball 检查和干净 consumer typecheck。

## 本地消费

尚未启用公开 npm 发布。要在插件项目中评估已检出的源码，可先构建本包，再在开发期间引用本地目录：

```bash
pnpm run build
pnpm add --save-exact ../dsh-plugin-ui-components
```

稳定集成应固定经过审查的 Git commit；待正式发布渠道确定后，再固定对应的包版本。

## 使用示例

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

消费方 DSH bundle 负责定义 `setDraft`、通过公开 DSH API 注册面板，并在构建期将本依赖物化到浏览器 client 中。最小 proof bundle fixture 见 [`examples/dsh-status-dock`](./examples/dsh-status-dock)。

## 安全

不要将任意 URL 传给产物组件。`SafePreview` 和 `ArtifactCard` 在消费方未传入非空 HTTPS origin allowlist 时会失败关闭。漏洞上报说明见 [SECURITY.md](./SECURITY.md)。

## 许可证

[MIT](./LICENSE)
