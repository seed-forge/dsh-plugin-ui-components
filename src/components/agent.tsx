import * as React from "react";

import type { StreamState } from "../contracts";
import { PrimitiveButton } from "../primitives";
import { useDshPluginUiStyles } from "../styles";

export interface ComposerActionProps {
  draft: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  onDraft: (draft: string) => void;
}

export function ComposerAction({ description, disabled = false, draft, label = "Add to composer", onDraft }: ComposerActionProps): React.ReactElement {
  useDshPluginUiStyles();
  return (
    <div>
      <PrimitiveButton disabled={disabled} onClick={() => onDraft(draft)} title={description}>{label}</PrimitiveButton>
      {description ? <span className="dsh-ui-muted" style={{ fontSize: 12, marginLeft: 8 }}>{description}</span> : null}
    </div>
  );
}

export interface StreamControllerProps {
  value: StreamState;
  onCancel?: () => void;
}

export function StreamController({ onCancel, value }: StreamControllerProps): React.ReactElement | null {
  useDshPluginUiStyles();
  if (value.status !== "streaming" && value.status !== "cancelling") return null;
  return (
    <div aria-live="polite" style={{ alignItems: "center", display: "flex", gap: 8 }}>
      <span className="dsh-ui-muted">{value.status === "cancelling" ? "Cancelling..." : "Streaming..."}</span>
      {value.canCancel ? <PrimitiveButton disabled={value.status === "cancelling" || !onCancel} onClick={onCancel}>Cancel</PrimitiveButton> : null}
    </div>
  );
}
