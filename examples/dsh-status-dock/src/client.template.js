window.__ModuleLoader__.load({ id: "dsh-plugin-ui-components-status-dock", factory: (require) => {
  const React = require("react");
  const { useState } = React;
  const h = React.createElement;
/* __DSH_FOUNDATION_CJS__ */
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
