import * as React from "react";

import type {
  ApprovalDecision,
  ApprovalValue,
  AsyncValue,
  RunStatusKind,
  RunStatusValue,
  StepDescriptor
} from "../contracts";
import { PrimitiveButton } from "../primitives";
import { useDshPluginUiStyles } from "../styles";
import { classNames } from "./shared";

export interface AsyncStateProps<T> {
  state: AsyncValue<T>;
  render: (data: T) => React.ReactNode;
  empty?: React.ReactNode;
  idle?: React.ReactNode;
  loading?: React.ReactNode;
  onRetry?: () => void;
}

export function AsyncState<T>({ empty, idle, loading, onRetry, render, state }: AsyncStateProps<T>): React.ReactElement {
  useDshPluginUiStyles();
  if (state.status === "success") return <>{render(state.data)}</>;
  if (state.status === "empty") return <div className="dsh-ui-state" role="status">{empty ?? state.message ?? "Nothing to show."}</div>;
  if (state.status === "idle") return <div className="dsh-ui-state" role="status">{idle ?? state.message ?? "Waiting to start."}</div>;
  if (state.status === "loading") return <div aria-busy="true" className="dsh-ui-state" role="status">{loading ?? state.message ?? "Loading..."}</div>;
  return (
    <div className="dsh-ui-state" role="alert">
      <div>{state.error}</div>
      {state.recoverable && onRetry ? <PrimitiveButton onClick={onRetry} style={{ marginTop: 8 }}>Retry</PrimitiveButton> : null}
    </div>
  );
}

const runStatusLabels: Record<RunStatusKind, string> = {
  queued: "Queued",
  running: "Running",
  waiting_for_human: "Waiting for human",
  ready_to_continue: "Ready to continue",
  succeeded: "Succeeded",
  failed: "Failed",
  cancelled: "Cancelled",
  blocked: "Blocked"
};

export interface RunStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: RunStatusValue;
}

export function RunStatus({ className, value, ...props }: RunStatusProps): React.ReactElement {
  useDshPluginUiStyles();
  const label = value.label ?? runStatusLabels[value.status];
  return (
    <span {...props} className={classNames("dsh-ui-status", `dsh-ui-status--${value.status}`, className)} title={value.detail}>
      <span aria-hidden="true" className="dsh-ui-status__dot" />
      <span>{label}</span>
    </span>
  );
}

export interface OutputTailProps extends React.HTMLAttributes<HTMLPreElement> {
  lines: readonly string[] | string;
  maxLines?: number;
  follow?: boolean;
  label?: string;
}

export function OutputTail({ className, follow = true, label = "Latest output", lines, maxLines = 200, ...props }: OutputTailProps): React.ReactElement {
  const ref = React.useRef<HTMLPreElement | null>(null);
  useDshPluginUiStyles();
  const visibleLines = React.useMemo(() => {
    const normalized = typeof lines === "string" ? lines.split(/\r?\n/) : [...lines];
    return normalized.slice(Math.max(0, normalized.length - maxLines));
  }, [lines, maxLines]);

  React.useEffect(() => {
    if (!follow || !ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [follow, visibleLines]);

  return (
    <pre {...props} aria-label={label} className={classNames("dsh-ui-output", className)} ref={ref} tabIndex={0}>
      {visibleLines.join("\n") || "No output yet."}
    </pre>
  );
}

export interface StepTimelineProps {
  steps: readonly StepDescriptor[];
  label?: string;
}

export function StepTimeline({ label = "Run steps", steps }: StepTimelineProps): React.ReactElement {
  useDshPluginUiStyles();
  return (
    <ol aria-label={label} className="dsh-ui-timeline">
      {steps.map((step) => (
        <li className="dsh-ui-timeline__item" data-status={step.status} key={step.id}>
          <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
            <strong>{step.label}</strong>
            <RunStatus value={{ status: step.status === "pending" ? "queued" : step.status }} />
          </div>
          {step.detail ? <div className="dsh-ui-muted" style={{ fontSize: 12, marginTop: 3 }}>{step.detail}</div> : null}
          {step.evidenceLabel ? <div className="dsh-ui-muted" style={{ fontSize: 12, marginTop: 3 }}>Evidence: {step.evidenceLabel}</div> : null}
          {step.error ? <div role="alert" style={{ color: "var(--dsw-alias-state-danger, #c2413b)", marginTop: 3 }}>{step.error}</div> : null}
        </li>
      ))}
    </ol>
  );
}

export interface ApprovalGateProps {
  value: ApprovalValue;
  onDecision?: (decision: ApprovalDecision) => void;
  reasonRequired?: boolean;
}

export function ApprovalGate({ onDecision, reasonRequired = true, value }: ApprovalGateProps): React.ReactElement {
  const [reason, setReason] = React.useState(value.reason ?? "");
  useDshPluginUiStyles();
  const isPending = value.status === "pending";
  const canSubmit = !reasonRequired || reason.trim().length > 0;
  const submit = (action: ApprovalDecision["action"]): void => {
    if (!isPending || !canSubmit || !onDecision) return;
    onDecision({ action, gateId: value.id, reason: reason.trim() });
  };

  return (
    <section aria-label={value.label} className="dsh-ui-gate">
      <div style={{ alignItems: "center", display: "flex", gap: 8, justifyContent: "space-between" }}>
        <strong>{value.label}</strong>
        <RunStatus value={{ label: value.status, status: value.status === "approved" ? "succeeded" : value.status === "rejected" ? "failed" : value.status === "expired" ? "blocked" : "waiting_for_human" }} />
      </div>
      {value.description ? <p className="dsh-ui-muted">{value.description}</p> : null}
      {value.evidence?.length ? <div className="dsh-ui-muted" style={{ fontSize: 12 }}>Evidence: {value.evidence.join(", ")}</div> : null}
      {isPending ? (
        <>
          <label htmlFor={`dsh-ui-gate-reason-${value.id}`} style={{ display: "block", fontSize: 12, marginTop: 10 }}>Decision reason{reasonRequired ? " (required)" : ""}</label>
          <textarea
            className="dsh-ui-gate__reason"
            id={`dsh-ui-gate-reason-${value.id}`}
            onChange={(event) => setReason(event.target.value)}
            value={reason}
          />
          <div className="dsh-ui-gate__actions">
            <PrimitiveButton disabled={!canSubmit || !onDecision} onClick={() => submit("approve")} tone="primary">Approve</PrimitiveButton>
            <PrimitiveButton disabled={!canSubmit || !onDecision} onClick={() => submit("reject")} tone="danger">Reject</PrimitiveButton>
          </div>
        </>
      ) : value.reason ? <div className="dsh-ui-muted" style={{ marginTop: 10 }}>Reason: {value.reason}</div> : null}
    </section>
  );
}
