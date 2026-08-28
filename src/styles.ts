import { useEffect } from "react";

export const dshPluginUiStyles = `
.dsh-ui-surface,.dsh-ui-panel,.dsh-ui-dock,.dsh-ui-state,.dsh-ui-artifact{box-sizing:border-box;color:var(--dsw-alias-label-primary,#1f2329);font-family:inherit}
.dsh-ui-surface{background:var(--dsw-alias-background-secondary,#f7f8fa);border:1px solid var(--dsw-alias-border-primary,#d9dde3);border-radius:8px}
.dsh-ui-panel{background:var(--dsw-alias-background-elevated,#fff);border:1px solid var(--dsw-alias-border-primary,#d9dde3);border-radius:8px;min-width:0}
.dsh-ui-panel__header,.dsh-ui-toolbar{align-items:center;display:flex;gap:8px;justify-content:space-between}
.dsh-ui-toolbar{flex-wrap:wrap;min-height:36px}
.dsh-ui-dock{background:var(--dsw-alias-background-elevated,#fff);border:1px solid var(--dsw-alias-border-primary,#d9dde3);border-radius:8px;box-shadow:0 12px 32px rgba(15,23,42,.16);max-height:calc(100vh - 104px);overflow:hidden;position:fixed;right:16px;bottom:88px;width:min(420px,calc(100vw - 32px));z-index:20}
.dsh-ui-dock__body{max-height:calc(100vh - 164px);overflow:auto}
.dsh-ui-scroll{overscroll-behavior:contain;overflow:auto}
.dsh-ui-button{align-items:center;background:transparent;border:1px solid var(--dsw-alias-border-primary,#d9dde3);border-radius:6px;color:inherit;cursor:pointer;display:inline-flex;font:inherit;gap:6px;justify-content:center;min-height:32px;padding:5px 9px}
.dsh-ui-button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,#eef0f2)}
.dsh-ui-button:focus-visible{outline:2px solid var(--dsw-alias-state-focus-primary,#2563eb);outline-offset:2px}
.dsh-ui-button:disabled{cursor:not-allowed;opacity:.55}
.dsh-ui-button--primary{background:var(--dsw-alias-state-primary,#2563eb);border-color:var(--dsw-alias-state-primary,#2563eb);color:#fff}
.dsh-ui-button--danger{border-color:var(--dsw-alias-state-danger,#c2413b);color:var(--dsw-alias-state-danger,#c2413b)}
.dsh-ui-status{align-items:center;display:inline-flex;font-size:12px;gap:6px;line-height:18px}
.dsh-ui-status__dot{background:currentColor;border-radius:999px;height:8px;width:8px}
.dsh-ui-status--running{color:var(--dsw-alias-state-primary,#2563eb)}.dsh-ui-status--succeeded{color:var(--dsw-alias-state-success,#15803d)}.dsh-ui-status--failed,.dsh-ui-status--blocked{color:var(--dsw-alias-state-danger,#c2413b)}.dsh-ui-status--waiting_for_human,.dsh-ui-status--ready_to_continue{color:var(--dsw-alias-state-warning,#b45309)}
.dsh-ui-output{background:#111827;border-radius:6px;color:#e5e7eb;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;margin:0;overflow:auto;padding:10px;white-space:pre-wrap}
.dsh-ui-timeline{display:grid;gap:10px;list-style:none;margin:0;padding:0}.dsh-ui-timeline__item{border-left:2px solid var(--dsw-alias-border-primary,#d9dde3);padding-left:10px}.dsh-ui-timeline__item[data-status="running"]{border-left-color:var(--dsw-alias-state-primary,#2563eb)}.dsh-ui-timeline__item[data-status="failed"],.dsh-ui-timeline__item[data-status="blocked"]{border-left-color:var(--dsw-alias-state-danger,#c2413b)}
.dsh-ui-gate,.dsh-ui-artifact{border:1px solid var(--dsw-alias-border-primary,#d9dde3);border-radius:6px;padding:12px}.dsh-ui-gate__actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsh-ui-gate__reason{box-sizing:border-box;font:inherit;margin-top:8px;min-height:68px;padding:7px;width:100%}.dsh-ui-artifact__preview{display:block;max-height:240px;max-width:100%;object-fit:contain}.dsh-ui-muted{color:var(--dsw-alias-label-tertiary,#6b7280)}
@media (max-width:767px){.dsh-ui-dock{bottom:76px;right:12px;width:calc(100vw - 24px)}.dsh-ui-dock__body{max-height:calc(100vh - 144px)}}
`;

const styleElementId = "dsh-plugin-ui-components-styles";

export function useDshPluginUiStyles(): void {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(styleElementId)) return;
    const style = document.createElement("style");
    style.id = styleElementId;
    style.textContent = dshPluginUiStyles;
    document.head.append(style);
  }, []);
}
