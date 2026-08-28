window.__ModuleLoader__.load({ id: "dsh-plugin-ui-components-status-dock", factory: (require) => {
  const React = require("react");
  const { useState } = React;
  const h = React.createElement;
  const foundationModule = { exports: {} };
  ((module, exports, require) => {
    'use strict';

    var React3 = require('react');
    var jsxRuntime = require('react/jsx-runtime');

    function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      var n = Object.create(null);
      if (e) {
        Object.keys(e).forEach(function (k) {
          if (k !== 'default') {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function () { return e[k]; }
            });
          }
        });
      }
      n.default = e;
      return Object.freeze(n);
    }

    var React3__namespace = /*#__PURE__*/_interopNamespace(React3);

    // src/primitives.tsx
    var DshPrimitivesContext = React3__namespace.createContext({});
    function DshPrimitiveProvider({ children, primitives }) {
      return /* @__PURE__ */ jsxRuntime.jsx(DshPrimitivesContext.Provider, { value: primitives, children });
    }
    function useDshPrimitives() {
      return React3__namespace.useContext(DshPrimitivesContext);
    }
    function PrimitiveButton({ className, tone = "default", ...props }) {
      const { Button } = useDshPrimitives();
      const toneClass = tone === "default" ? "" : ` dsh-ui-button--${tone}`;
      const resolvedClassName = `dsh-ui-button${toneClass}${className ? ` ${className}` : ""}`;
      const buttonProps = { ...props, type: props.type ?? "button" };
      if (Button) return /* @__PURE__ */ jsxRuntime.jsx(Button, { ...buttonProps, className: resolvedClassName });
      return /* @__PURE__ */ jsxRuntime.jsx("button", { ...buttonProps, className: resolvedClassName });
    }
    var dshPluginUiStyles = `
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
    var styleElementId = "dsh-plugin-ui-components-styles";
    function useDshPluginUiStyles() {
      React3.useEffect(() => {
        if (typeof document === "undefined") return;
        if (document.getElementById(styleElementId)) return;
        const style = document.createElement("style");
        style.id = styleElementId;
        style.textContent = dshPluginUiStyles;
        document.head.append(style);
      }, []);
    }
    function ComposerAction({ description, disabled = false, draft, label = "Add to composer", onDraft }) {
      useDshPluginUiStyles();
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx(PrimitiveButton, { disabled, onClick: () => onDraft(draft), title: description, children: label }),
        description ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dsh-ui-muted", style: { fontSize: 12, marginLeft: 8 }, children: description }) : null
      ] });
    }
    function StreamController({ onCancel, value }) {
      useDshPluginUiStyles();
      if (value.status !== "streaming" && value.status !== "cancelling") return null;
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { "aria-live": "polite", style: { alignItems: "center", display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dsh-ui-muted", children: value.status === "cancelling" ? "Cancelling..." : "Streaming..." }),
        value.canCancel ? /* @__PURE__ */ jsxRuntime.jsx(PrimitiveButton, { disabled: value.status === "cancelling" || !onCancel, onClick: onCancel, children: "Cancel" }) : null
      ] });
    }
    function normalizedOrigins(origins) {
      return new Set((origins ?? []).map((origin) => origin.replace(/\/$/, "")));
    }
    function isSafePreviewUrl(value, allowedOrigins) {
      if (!value || !allowedOrigins?.length) return false;
      try {
        const url = new URL(value);
        if (url.protocol !== "https:") return false;
        const origins = normalizedOrigins(allowedOrigins);
        return origins.has(url.origin);
      } catch {
        return false;
      }
    }
    function SafePreview({ artifact, onRequestRecovery }) {
      useDshPluginUiStyles();
      const safeUrl = isSafePreviewUrl(artifact.safeUrl, artifact.allowedOrigins) ? artifact.safeUrl : void 0;
      if (!safeUrl) {
        return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dsh-ui-muted", role: "status", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { children: artifact.unavailableReason ?? "A governed preview URL is unavailable." }),
          artifact.recoveryLabel && onRequestRecovery ? /* @__PURE__ */ jsxRuntime.jsx(PrimitiveButton, { onClick: () => onRequestRecovery(artifact), style: { marginTop: 8 }, children: artifact.recoveryLabel }) : null
        ] });
      }
      if (artifact.kind === "image") return /* @__PURE__ */ jsxRuntime.jsx("img", { alt: artifact.label, className: "dsh-ui-artifact__preview", src: safeUrl });
      if (artifact.kind === "video") return /* @__PURE__ */ jsxRuntime.jsx("video", { "aria-label": artifact.label, className: "dsh-ui-artifact__preview", controls: true, preload: "metadata", src: safeUrl });
      if (artifact.kind === "audio") return /* @__PURE__ */ jsxRuntime.jsx("audio", { "aria-label": artifact.label, controls: true, preload: "metadata", src: safeUrl });
      return /* @__PURE__ */ jsxRuntime.jsxs("a", { href: safeUrl, rel: "noreferrer", target: "_blank", children: [
        "Open ",
        artifact.label
      ] });
    }
    function ArtifactCard({ allowedOrigins, artifact, onRequestRecovery }) {
      useDshPluginUiStyles();
      const preview = { ...artifact, ...allowedOrigins ? { allowedOrigins } : {} };
      return /* @__PURE__ */ jsxRuntime.jsxs("article", { className: "dsh-ui-artifact", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { alignItems: "center", display: "flex", gap: 8, justifyContent: "space-between", marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: artifact.label }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dsh-ui-muted", style: { fontSize: 12 }, children: artifact.kind })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(SafePreview, { artifact: preview, ...onRequestRecovery ? { onRequestRecovery } : {} }),
        artifact.provenance ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dsh-ui-muted", style: { fontSize: 12, marginTop: 8 }, children: [
          "Source: ",
          artifact.provenance
        ] }) : null
      ] });
    }

    // src/components/shared.ts
    function classNames(...values) {
      return values.filter(Boolean).join(" ");
    }
    function PluginSurface({ children, className, label, ...props }) {
      useDshPluginUiStyles();
      return /* @__PURE__ */ jsxRuntime.jsx("section", { ...props, "aria-label": label, className: classNames("dsh-ui-surface", className), children });
    }
    function PanelShell({
      actions,
      children,
      className,
      closeLabel = "Close panel",
      description,
      onClose,
      title,
      ...props
    }) {
      useDshPluginUiStyles();
      return /* @__PURE__ */ jsxRuntime.jsxs("section", { ...props, className: classNames("dsh-ui-panel", className), children: [
        /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "dsh-ui-panel__header", style: { padding: "12px 12px 10px" }, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("strong", { children: title }),
            description ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dsh-ui-muted", style: { fontSize: 12, marginTop: 3 }, children: description }) : null
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { alignItems: "center", display: "flex", gap: 8 }, children: [
            actions,
            onClose ? /* @__PURE__ */ jsxRuntime.jsx(PrimitiveButton, { "aria-label": closeLabel, onClick: onClose, title: closeLabel, children: "Close" }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "0 12px 12px" }, children })
      ] });
    }
    function Dock({
      children,
      className,
      closeLabel = "Close dock",
      modal = false,
      onClose,
      open,
      title,
      ...props
    }) {
      const closeButtonRef = React3__namespace.useRef(null);
      useDshPluginUiStyles();
      React3__namespace.useEffect(() => {
        if (!open || typeof document === "undefined") return;
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const onKeyDown = (event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
        return () => {
          window.clearTimeout(focusTimer);
          document.removeEventListener("keydown", onKeyDown);
          previousFocus?.focus();
        };
      }, [onClose, open]);
      if (!open) return null;
      return /* @__PURE__ */ jsxRuntime.jsxs(
        "aside",
        {
          ...props,
          "aria-label": title,
          "aria-modal": modal || void 0,
          className: classNames("dsh-ui-dock", className),
          role: modal ? "dialog" : "complementary",
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "dsh-ui-panel__header", style: { padding: "12px" }, children: [
              /* @__PURE__ */ jsxRuntime.jsx("strong", { children: title }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  "aria-label": closeLabel,
                  className: "dsh-ui-button",
                  onClick: onClose,
                  ref: closeButtonRef,
                  title: closeLabel,
                  type: "button",
                  children: "Close"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dsh-ui-dock__body", style: { padding: "0 12px 12px" }, children })
          ]
        }
      );
    }
    function Drawer(props) {
      return /* @__PURE__ */ jsxRuntime.jsx(Dock, { ...props, modal: true });
    }
    function ScrollRegion({ children, className, label, ...props }) {
      useDshPluginUiStyles();
      return /* @__PURE__ */ jsxRuntime.jsx("div", { ...props, "aria-label": label, className: classNames("dsh-ui-scroll", className), role: "region", tabIndex: 0, children });
    }
    function Toolbar({ children, className, label, ...props }) {
      useDshPluginUiStyles();
      return /* @__PURE__ */ jsxRuntime.jsx("div", { ...props, "aria-label": label, className: classNames("dsh-ui-toolbar", className), role: "toolbar", children });
    }
    function AsyncState({ empty, idle, loading, onRetry, render, state }) {
      useDshPluginUiStyles();
      if (state.status === "success") return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: render(state.data) });
      if (state.status === "empty") return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dsh-ui-state", role: "status", children: empty ?? state.message ?? "Nothing to show." });
      if (state.status === "idle") return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dsh-ui-state", role: "status", children: idle ?? state.message ?? "Waiting to start." });
      if (state.status === "loading") return /* @__PURE__ */ jsxRuntime.jsx("div", { "aria-busy": "true", className: "dsh-ui-state", role: "status", children: loading ?? state.message ?? "Loading..." });
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dsh-ui-state", role: "alert", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { children: state.error }),
        state.recoverable && onRetry ? /* @__PURE__ */ jsxRuntime.jsx(PrimitiveButton, { onClick: onRetry, style: { marginTop: 8 }, children: "Retry" }) : null
      ] });
    }
    var runStatusLabels = {
      queued: "Queued",
      running: "Running",
      waiting_for_human: "Waiting for human",
      ready_to_continue: "Ready to continue",
      succeeded: "Succeeded",
      failed: "Failed",
      cancelled: "Cancelled",
      blocked: "Blocked"
    };
    function RunStatus({ className, value, ...props }) {
      useDshPluginUiStyles();
      const label = value.label ?? runStatusLabels[value.status];
      return /* @__PURE__ */ jsxRuntime.jsxs("span", { ...props, className: classNames("dsh-ui-status", `dsh-ui-status--${value.status}`, className), title: value.detail, children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": "true", className: "dsh-ui-status__dot" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: label })
      ] });
    }
    function OutputTail({ className, follow = true, label = "Latest output", lines, maxLines = 200, ...props }) {
      const ref = React3__namespace.useRef(null);
      useDshPluginUiStyles();
      const visibleLines = React3__namespace.useMemo(() => {
        const normalized = typeof lines === "string" ? lines.split(/\r?\n/) : [...lines];
        return normalized.slice(Math.max(0, normalized.length - maxLines));
      }, [lines, maxLines]);
      React3__namespace.useEffect(() => {
        if (!follow || !ref.current) return;
        ref.current.scrollTop = ref.current.scrollHeight;
      }, [follow, visibleLines]);
      return /* @__PURE__ */ jsxRuntime.jsx("pre", { ...props, "aria-label": label, className: classNames("dsh-ui-output", className), ref, tabIndex: 0, children: visibleLines.join("\n") || "No output yet." });
    }
    function StepTimeline({ label = "Run steps", steps }) {
      useDshPluginUiStyles();
      return /* @__PURE__ */ jsxRuntime.jsx("ol", { "aria-label": label, className: "dsh-ui-timeline", children: steps.map((step) => /* @__PURE__ */ jsxRuntime.jsxs("li", { className: "dsh-ui-timeline__item", "data-status": step.status, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { alignItems: "center", display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: step.label }),
          /* @__PURE__ */ jsxRuntime.jsx(RunStatus, { value: { status: step.status === "pending" ? "queued" : step.status } })
        ] }),
        step.detail ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "dsh-ui-muted", style: { fontSize: 12, marginTop: 3 }, children: step.detail }) : null,
        step.evidenceLabel ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dsh-ui-muted", style: { fontSize: 12, marginTop: 3 }, children: [
          "Evidence: ",
          step.evidenceLabel
        ] }) : null,
        step.error ? /* @__PURE__ */ jsxRuntime.jsx("div", { role: "alert", style: { color: "var(--dsw-alias-state-danger, #c2413b)", marginTop: 3 }, children: step.error }) : null
      ] }, step.id)) });
    }
    function ApprovalGate({ onDecision, reasonRequired = true, value }) {
      const [reason, setReason] = React3__namespace.useState(value.reason ?? "");
      useDshPluginUiStyles();
      const isPending = value.status === "pending";
      const canSubmit = !reasonRequired || reason.trim().length > 0;
      const submit = (action) => {
        if (!isPending || !canSubmit || !onDecision) return;
        onDecision({ action, gateId: value.id, reason: reason.trim() });
      };
      return /* @__PURE__ */ jsxRuntime.jsxs("section", { "aria-label": value.label, className: "dsh-ui-gate", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { alignItems: "center", display: "flex", gap: 8, justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: value.label }),
          /* @__PURE__ */ jsxRuntime.jsx(RunStatus, { value: { label: value.status, status: value.status === "approved" ? "succeeded" : value.status === "rejected" ? "failed" : value.status === "expired" ? "blocked" : "waiting_for_human" } })
        ] }),
        value.description ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "dsh-ui-muted", children: value.description }) : null,
        value.evidence?.length ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dsh-ui-muted", style: { fontSize: 12 }, children: [
          "Evidence: ",
          value.evidence.join(", ")
        ] }) : null,
        isPending ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: `dsh-ui-gate-reason-${value.id}`, style: { display: "block", fontSize: 12, marginTop: 10 }, children: [
            "Decision reason",
            reasonRequired ? " (required)" : ""
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "textarea",
            {
              className: "dsh-ui-gate__reason",
              id: `dsh-ui-gate-reason-${value.id}`,
              onChange: (event) => setReason(event.target.value),
              value: reason
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dsh-ui-gate__actions", children: [
            /* @__PURE__ */ jsxRuntime.jsx(PrimitiveButton, { disabled: !canSubmit || !onDecision, onClick: () => submit("approve"), tone: "primary", children: "Approve" }),
            /* @__PURE__ */ jsxRuntime.jsx(PrimitiveButton, { disabled: !canSubmit || !onDecision, onClick: () => submit("reject"), tone: "danger", children: "Reject" })
          ] })
        ] }) : value.reason ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "dsh-ui-muted", style: { marginTop: 10 }, children: [
          "Reason: ",
          value.reason
        ] }) : null
      ] });
    }

    // src/registry/registry.ts
    var ComponentRegistry = class {
      constructor(duplicatePolicy = "reject") {
        this.duplicatePolicy = duplicatePolicy;
      }
      duplicatePolicy;
      entries = /* @__PURE__ */ new Map();
      listeners = /* @__PURE__ */ new Set();
      token = 0;
      register(value) {
        const current = this.entries.get(value.id);
        if (current && this.duplicatePolicy === "reject") {
          throw new Error(`Duplicate registry id: ${value.id}`);
        }
        const token = ++this.token;
        this.entries.set(value.id, { value, token });
        this.notify();
        return () => {
          if (this.entries.get(value.id)?.token !== token) return;
          this.entries.delete(value.id);
          this.notify();
        };
      }
      get(id) {
        return this.entries.get(id)?.value;
      }
      list(options = {}) {
        const includeDisabled = options.includeDisabled ?? false;
        return [...this.entries.values()].map((entry) => entry.value).filter((entry) => includeDisabled || this.isEnabled(entry)).sort((left, right) => (left.order ?? 0) - (right.order ?? 0) || left.id.localeCompare(right.id));
      }
      subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
      }
      clear() {
        if (this.entries.size === 0) return;
        this.entries.clear();
        this.notify();
      }
      isEnabled(entry) {
        return typeof entry.enabled === "function" ? entry.enabled() : entry.enabled !== false;
      }
      notify() {
        this.listeners.forEach((listener) => listener());
      }
    };
    var TabRegistry = class extends ComponentRegistry {
    };
    var ViewerRegistry = class extends ComponentRegistry {
      findFor(artifact) {
        return this.list().find((viewer) => viewer.canView(artifact));
      }
    };

    // src/tokens/index.ts
    var dshToken = {
      canvas: "var(--dsw-alias-background-primary, #ffffff)",
      surface: "var(--dsw-alias-background-secondary, #f7f8fa)",
      surfaceRaised: "var(--dsw-alias-background-elevated, #ffffff)",
      border: "var(--dsw-alias-border-primary, #d9dde3)",
      text: "var(--dsw-alias-label-primary, #1f2329)",
      mutedText: "var(--dsw-alias-label-tertiary, #6b7280)",
      focus: "var(--dsw-alias-state-focus-primary, #2563eb)",
      primary: "var(--dsw-alias-state-primary, #2563eb)",
      danger: "var(--dsw-alias-state-danger, #c2413b)",
      success: "var(--dsw-alias-state-success, #15803d)",
      warning: "var(--dsw-alias-state-warning, #b45309)"
    };
    function withFallback(variable, fallback) {
      return `var(${variable}, ${fallback})`;
    }

    exports.ApprovalGate = ApprovalGate;
    exports.ArtifactCard = ArtifactCard;
    exports.AsyncState = AsyncState;
    exports.ComponentRegistry = ComponentRegistry;
    exports.ComposerAction = ComposerAction;
    exports.Dock = Dock;
    exports.Drawer = Drawer;
    exports.DshPrimitiveProvider = DshPrimitiveProvider;
    exports.OutputTail = OutputTail;
    exports.PanelShell = PanelShell;
    exports.PluginSurface = PluginSurface;
    exports.PrimitiveButton = PrimitiveButton;
    exports.RunStatus = RunStatus;
    exports.SafePreview = SafePreview;
    exports.ScrollRegion = ScrollRegion;
    exports.StepTimeline = StepTimeline;
    exports.StreamController = StreamController;
    exports.TabRegistry = TabRegistry;
    exports.Toolbar = Toolbar;
    exports.ViewerRegistry = ViewerRegistry;
    exports.dshPluginUiStyles = dshPluginUiStyles;
    exports.dshToken = dshToken;
    exports.isSafePreviewUrl = isSafePreviewUrl;
    exports.useDshPluginUiStyles = useDshPluginUiStyles;
    exports.useDshPrimitives = useDshPrimitives;
    exports.withFallback = withFallback;
  })(foundationModule, foundationModule.exports, require);
  const {
    ApprovalGate,
    ArtifactCard,
    ComposerAction,
    Dock,
    OutputTail,
    PluginSurface,
    RunStatus,
    StepTimeline,
    Toolbar
  } = foundationModule.exports;

  const name = "dsh-plugin-ui-components-status-dock";
  const inject = ["slots"];

  function StatusDockToggle({ inputActions, sessionId }) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    const draft = (value) => inputActions?.setDraft?.(value);
    return h(React.Fragment, null, [
      h("button", {
        "aria-expanded": open,
        "aria-label": open ? "Close UI component proof" : "Open UI component proof",
        className: "dsh-ui-button",
        key: "toggle",
        onClick: () => setOpen((value) => !value),
        type: "button"
      }, "UI proof"),
      h(Dock, { key: "dock", onClose: close, open, title: "UI component proof" },
        h(PluginSurface, { label: "Component library status" },
          h(Toolbar, { label: "Task status actions" }, [
            h(RunStatus, { key: "status", value: { detail: `session=${sessionId || "new"}`, status: "waiting_for_human" } }),
            h(ComposerAction, {
              description: "Adds a draft only; native Composer submission stays explicit.",
              draft: "Please review the task-status proof evidence. Do not claim execution from this UI state.",
              key: "draft",
              onDraft: draft
            })
          ]),
          h(OutputTail, { key: "output", lines: ["registered: status dock", "artifact: waiting for review", "composer: draft-only action available"], maxLines: 4 }),
          h(StepTimeline, {
            key: "steps",
            steps: [
              { id: "render", label: "Render components", status: "succeeded", evidenceLabel: "DSH host" },
              { id: "approval", label: "Human approval", status: "waiting_for_human", evidenceLabel: "operator decision" }
            ]
          }),
          h(ApprovalGate, {
            key: "approval",
            onDecision: (decision) => draft(`approval_gate: ${decision.gateId}\naction: ${decision.action}\nreason: ${decision.reason}\nThis is a draft only; verify executor evidence before continuing.`),
            value: { id: "proof-approval", label: "Record proof review", status: "pending" }
          }),
          h(ArtifactCard, {
            allowedOrigins: ["https://example.test"],
            artifact: {
              id: "safe-artifact",
              kind: "link",
              label: "Governed artifact",
              provenance: "host proof fixture",
              safeUrl: "https://example.test/proof"
            },
            key: "artifact"
          })
        )
      )
    ]);
  }

  function apply(context) {
    context.slots.inject("conversation.session.header.actions", () => context.slots.register(
      { id: name, label: "UI proof", name: "conversation.session.header.actions", order: 85 },
      StatusDockToggle
    ));
    // A blank DSH session has no header, but it still has the native Composer.
    context.slots.inject("conversation.input.left", () => context.slots.register(
      { id: name, label: "UI proof", name: "conversation.input.left", order: 85 },
      StatusDockToggle
    ));
  }

  return { apply, inject, name };
} });
