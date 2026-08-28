export type AsyncStatus = "idle" | "loading" | "success" | "empty" | "error";

export type AsyncValue<T> =
  | { status: "idle"; message?: string }
  | { status: "loading"; message?: string }
  | { status: "success"; data: T; message?: string }
  | { status: "empty"; message?: string }
  | { status: "error"; error: string; recoverable?: boolean; message?: string };

export type RunStatusKind =
  | "queued"
  | "running"
  | "waiting_for_human"
  | "ready_to_continue"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "blocked";

export interface RunStatusValue {
  status: RunStatusKind;
  label?: string;
  detail?: string;
  updatedAt?: string;
}

export type StreamStatus = "idle" | "streaming" | "cancelling" | "completed" | "errored" | "cancelled";

export interface StreamState {
  status: StreamStatus;
  canCancel: boolean;
  error?: string;
}

export type StepStatus = "pending" | "running" | "waiting_for_human" | "succeeded" | "failed" | "cancelled" | "blocked";

export interface StepDescriptor {
  id: string;
  label: string;
  status: StepStatus;
  detail?: string;
  error?: string;
  evidenceLabel?: string;
}

export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";

export interface ApprovalValue {
  id: string;
  status: ApprovalStatus;
  label: string;
  description?: string;
  reason?: string;
  operator?: string;
  evidence?: readonly string[];
}

export interface ApprovalDecision {
  gateId: string;
  action: "approve" | "reject";
  reason: string;
}

export type ArtifactKind = "image" | "video" | "audio" | "document" | "link" | "unknown";

export interface ArtifactDescriptor {
  id: string;
  label: string;
  kind: ArtifactKind;
  safeUrl?: string;
  provenance?: string;
  unavailableReason?: string;
  recoveryLabel?: string;
}

export interface SafePreviewDescriptor extends ArtifactDescriptor {
  allowedOrigins?: readonly string[];
}
