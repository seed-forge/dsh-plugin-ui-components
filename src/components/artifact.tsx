import * as React from "react";

import type { ArtifactDescriptor, SafePreviewDescriptor } from "../contracts";
import { PrimitiveButton } from "../primitives";
import { useDshPluginUiStyles } from "../styles";

function normalizedOrigins(origins: readonly string[] | undefined): Set<string> {
  return new Set((origins ?? []).map((origin) => origin.replace(/\/$/, "")));
}

export function isSafePreviewUrl(value: string | undefined, allowedOrigins?: readonly string[]): value is string {
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

export interface SafePreviewProps {
  artifact: SafePreviewDescriptor;
  onRequestRecovery?: (artifact: SafePreviewDescriptor) => void;
}

export function SafePreview({ artifact, onRequestRecovery }: SafePreviewProps): React.ReactElement {
  useDshPluginUiStyles();
  const safeUrl = isSafePreviewUrl(artifact.safeUrl, artifact.allowedOrigins) ? artifact.safeUrl : undefined;
  if (!safeUrl) {
    return (
      <div className="dsh-ui-muted" role="status">
        <div>{artifact.unavailableReason ?? "A governed preview URL is unavailable."}</div>
        {artifact.recoveryLabel && onRequestRecovery ? <PrimitiveButton onClick={() => onRequestRecovery(artifact)} style={{ marginTop: 8 }}>{artifact.recoveryLabel}</PrimitiveButton> : null}
      </div>
    );
  }

  if (artifact.kind === "image") return <img alt={artifact.label} className="dsh-ui-artifact__preview" src={safeUrl} />;
  if (artifact.kind === "video") return <video aria-label={artifact.label} className="dsh-ui-artifact__preview" controls preload="metadata" src={safeUrl} />;
  if (artifact.kind === "audio") return <audio aria-label={artifact.label} controls preload="metadata" src={safeUrl} />;
  return <a href={safeUrl} rel="noreferrer" target="_blank">Open {artifact.label}</a>;
}

export interface ArtifactCardProps {
  artifact: ArtifactDescriptor;
  allowedOrigins?: readonly string[];
  onRequestRecovery?: (artifact: SafePreviewDescriptor) => void;
}

export function ArtifactCard({ allowedOrigins, artifact, onRequestRecovery }: ArtifactCardProps): React.ReactElement {
  useDshPluginUiStyles();
  const preview: SafePreviewDescriptor = { ...artifact, ...(allowedOrigins ? { allowedOrigins } : {}) };
  return (
    <article className="dsh-ui-artifact">
      <div style={{ alignItems: "center", display: "flex", gap: 8, justifyContent: "space-between", marginBottom: 8 }}>
        <strong>{artifact.label}</strong>
        <span className="dsh-ui-muted" style={{ fontSize: 12 }}>{artifact.kind}</span>
      </div>
      <SafePreview artifact={preview} {...(onRequestRecovery ? { onRequestRecovery } : {})} />
      {artifact.provenance ? <div className="dsh-ui-muted" style={{ fontSize: 12, marginTop: 8 }}>Source: {artifact.provenance}</div> : null}
    </article>
  );
}
