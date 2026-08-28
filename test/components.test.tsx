import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ApprovalGate,
  AsyncState,
  ArtifactCard,
  ComposerAction,
  Dock,
  Drawer,
  DshPrimitiveProvider,
  OutputTail,
  PanelShell,
  PluginSurface,
  PrimitiveButton,
  RunStatus,
  SafePreview,
  ScrollRegion,
  StepTimeline,
  StreamController,
  Toolbar,
  withFallback,
  isSafePreviewUrl
} from "../src";

afterEach(cleanup);

describe("host-aware components", () => {
  it("closes a dock with Escape without relying on host DOM", () => {
    const onClose = vi.fn();
    render(<Dock onClose={onClose} open title="Task status">Content</Dock>);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("complementary", { name: "Task status" })).not.toBeNull();
  });

  it("keeps composer actions as draft injection only", () => {
    const onDraft = vi.fn();
    render(<ComposerAction draft="review artifact" onDraft={onDraft} />);

    fireEvent.click(screen.getByRole("button", { name: "Add to composer" }));
    expect(onDraft).toHaveBeenCalledWith("review artifact");
    expect(onDraft).toHaveBeenCalledTimes(1);
  });

  it("distinguishes optional agent controls without auto-submitting work", () => {
    const onDecision = vi.fn();
    render(
      <>
        <ComposerAction description="Adds a draft only" disabled draft="review artifact" label="Draft review" onDraft={vi.fn()} />
        <StreamController value={{ canCancel: true, status: "cancelling" }} />
        <StreamController value={{ canCancel: false, status: "streaming" }} />
        <ApprovalGate
          onDecision={onDecision}
          reasonRequired={false}
          value={{ description: "A human choice is required.", evidence: ["run-42"], id: "optional-reason", label: "Continue run", status: "pending" }}
        />
      </>
    );

    expect(screen.getByText("Adds a draft only")).not.toBeNull();
    expect((screen.getByRole("button", { name: "Draft review" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("Cancelling...")).not.toBeNull();
    expect((screen.getByRole("button", { name: "Cancel" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getAllByText("Streaming...")).toHaveLength(1);
    expect(screen.getByText("Evidence: run-42")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Reject" }));
    expect(onDecision).toHaveBeenCalledWith({ action: "reject", gateId: "optional-reason", reason: "" });
  });

  it("requires a recorded reason before an approval decision", () => {
    const onDecision = vi.fn();
    render(<ApprovalGate onDecision={onDecision} value={{ id: "gate", label: "Approve artifact", status: "pending" }} />);

    expect((screen.getByRole("button", { name: "Approve" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getByLabelText("Decision reason (required)"), { target: { value: "Reviewed output" } });
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onDecision).toHaveBeenCalledWith({ action: "approve", gateId: "gate", reason: "Reviewed output" });
  });

  it("fails closed for local paths and URLs without an explicit allowlist", () => {
    render(<SafePreview artifact={{ id: "local", kind: "image", label: "Local file", safeUrl: "file:///private/output.png" }} />);

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("A governed preview URL is unavailable.")).not.toBeNull();
    expect(isSafePreviewUrl("https://example.test/a.png")).toBe(false);
    expect(isSafePreviewUrl("https://example.test/a.png", ["https://example.test"])).toBe(true);
    expect(isSafePreviewUrl("https://other.test/a.png", ["https://example.test"])).toBe(false);
  });

  it("rejects malformed and non-HTTPS preview URLs while normalizing explicit origins", () => {
    render(<ArtifactCard artifact={{ id: "unconfigured", kind: "document", label: "Unconfigured", safeUrl: "https://example.test/report" }} />);

    expect(screen.queryByRole("link", { name: "Open Unconfigured" })).toBeNull();
    expect(screen.getByText("A governed preview URL is unavailable.")).not.toBeNull();
    expect(isSafePreviewUrl("not a URL", ["https://example.test"])).toBe(false);
    expect(isSafePreviewUrl("http://example.test/report", ["https://example.test"])).toBe(false);
    expect(isSafePreviewUrl("https://example.test/report", ["https://example.test/"])).toBe(true);
  });

  it("renders bounded output and distinguishable step states", () => {
    render(
      <>
        <OutputTail lines={["one", "two", "three"]} maxLines={2} />
        <StepTimeline steps={[
          { id: "prepare", label: "Prepare", status: "succeeded" },
          { id: "approval", label: "Approval", status: "waiting_for_human", evidenceLabel: "operator" }
        ]} />
      </>
    );

    expect(screen.getByLabelText("Latest output").textContent).toBe("two\nthree");
    expect(screen.getByText("Waiting for human")).not.toBeNull();
    expect(screen.getByText("Evidence: operator")).not.toBeNull();
  });

  it("exposes labeled layout boundaries and preserves panel and drawer close contracts", () => {
    const onPanelClose = vi.fn();
    render(
      <PluginSurface label="Plugin surface">
        <PanelShell actions={<button type="button">Refresh</button>} description="Current execution state" onClose={onPanelClose} title="Status panel">
          <Toolbar label="Status actions"><button type="button">Refresh</button></Toolbar>
          <ScrollRegion label="Status content">Content</ScrollRegion>
        </PanelShell>
        <Drawer onClose={() => undefined} open title="Mobile status">Drawer content</Drawer>
      </PluginSurface>
    );

    expect(screen.getByLabelText("Plugin surface").tagName).toBe("SECTION");
    expect(screen.getByRole("toolbar", { name: "Status actions" })).not.toBeNull();
    expect(screen.getByRole("region", { name: "Status content" })).not.toBeNull();
    expect(screen.getByRole("dialog", { name: "Mobile status" }).getAttribute("aria-modal")).toBe("true");
    expect(screen.getByText("Current execution state")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close panel" }));
    expect(onPanelClose).toHaveBeenCalledTimes(1);
  });

  it("renders async and stream feedback with retry and cancel boundaries", () => {
    const onRetry = vi.fn();
    const onCancel = vi.fn();
    const { rerender } = render(
      <>
        <AsyncState onRetry={onRetry} render={(value: string) => <div>{value}</div>} state={{ error: "Unavailable", recoverable: true, status: "error" }} />
        <StreamController onCancel={onCancel} value={{ canCancel: true, status: "streaming" }} />
        <RunStatus value={{ detail: "job-42", status: "running" }} />
      </>
    );

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Running").parentElement?.getAttribute("title")).toBe("job-42");

    rerender(<AsyncState render={(value: string) => <div>{value}</div>} state={{ data: "Ready", status: "success" }} />);
    expect(screen.getByText("Ready")).not.toBeNull();
  });

  it("renders async idle, loading, and empty states without pretending work completed", () => {
    const renderValue = (value: string) => <div>{value}</div>;
    const { rerender } = render(<AsyncState render={renderValue} state={{ status: "idle" }} />);
    expect(screen.getByRole("status").textContent).toBe("Waiting to start.");

    rerender(<AsyncState render={renderValue} state={{ status: "loading" }} />);
    expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("true");

    rerender(<AsyncState render={renderValue} state={{ status: "empty" }} />);
    expect(screen.getByRole("status").textContent).toBe("Nothing to show.");
  });

  it("uses supplied state content and keeps unrecoverable errors non-actionable", () => {
    const renderValue = (value: string) => <div>{value}</div>;
    const { rerender } = render(<AsyncState empty="No matching tasks" render={renderValue} state={{ message: "Ignored message", status: "empty" }} />);
    expect(screen.getByRole("status").textContent).toBe("No matching tasks");

    rerender(<AsyncState idle="Ready when you are" render={renderValue} state={{ message: "Ignored message", status: "idle" }} />);
    expect(screen.getByRole("status").textContent).toBe("Ready when you are");

    rerender(<AsyncState loading="Loading safe metadata" render={renderValue} state={{ message: "Ignored message", status: "loading" }} />);
    expect(screen.getByRole("status").textContent).toBe("Loading safe metadata");

    rerender(<AsyncState render={renderValue} state={{ error: "Policy blocked this operation", recoverable: false, status: "error" }} />);
    expect(screen.getByRole("alert").textContent).toBe("Policy blocked this operation");
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("renders governed media only from an explicit allowed origin and exposes recovery", () => {
    const allowedOrigins = ["https://example.test"];
    const onRequestRecovery = vi.fn();
    const { rerender } = render(<SafePreview artifact={{ allowedOrigins, id: "image", kind: "image", label: "Image artifact", safeUrl: "https://example.test/image.png" }} />);
    expect(screen.getByRole("img", { name: "Image artifact" }).getAttribute("src")).toBe("https://example.test/image.png");

    rerender(<SafePreview artifact={{ allowedOrigins, id: "video", kind: "video", label: "Video artifact", safeUrl: "https://example.test/video.mp4" }} />);
    expect(screen.getByLabelText("Video artifact").tagName).toBe("VIDEO");

    rerender(<SafePreview artifact={{ allowedOrigins, id: "audio", kind: "audio", label: "Audio artifact", safeUrl: "https://example.test/audio.mp3" }} />);
    expect(screen.getByLabelText("Audio artifact").tagName).toBe("AUDIO");

    rerender(<ArtifactCard allowedOrigins={allowedOrigins} artifact={{ id: "link", kind: "link", label: "Link artifact", provenance: "job-42", safeUrl: "https://example.test/report" }} />);
    expect(screen.getByRole("link", { name: "Open Link artifact" })).not.toBeNull();
    expect(screen.getByText("Source: job-42")).not.toBeNull();

    const blockedArtifact = { id: "blocked", kind: "document" as const, label: "Blocked artifact", recoveryLabel: "Request recovery", safeUrl: "https://other.test/report" };
    rerender(<ArtifactCard allowedOrigins={allowedOrigins} artifact={blockedArtifact} onRequestRecovery={onRequestRecovery} />);
    fireEvent.click(screen.getByRole("button", { name: "Request recovery" }));
    expect(onRequestRecovery).toHaveBeenCalledWith(expect.objectContaining({ id: "blocked" }));
  });

  it("reports completed stream state as absent and preserves the approval record after a decision", () => {
    const { rerender } = render(<StreamController value={{ canCancel: false, status: "completed" }} />);
    expect(screen.queryByText("Streaming...")).toBeNull();

    rerender(<ApprovalGate value={{ id: "recorded", label: "Recorded approval", reason: "Reviewed", status: "approved" }} />);
    expect(screen.getByText("Reason: Reviewed")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();
  });

  it("renders terminal approval and output variants with explicit labels", () => {
    render(
      <>
        <ApprovalGate value={{ id: "rejected", label: "Rejected approval", status: "rejected" }} />
        <OutputTail follow={false} label="Empty output" lines="" />
        <RunStatus value={{ label: "Custom queue label", status: "queued" }} />
        <StepTimeline steps={[{ detail: "Tool did not complete", error: "Missing approval", id: "blocked", label: "Blocked step", status: "blocked" }]} />
        <PrimitiveButton className="plugin-action" tone="danger" type="submit">Submit explicitly</PrimitiveButton>
      </>
    );

    expect(screen.getByText("rejected")).not.toBeNull();
    expect(screen.getByLabelText("Empty output").textContent).toBe("No output yet.");
    expect(screen.getByText("Custom queue label")).not.toBeNull();
    expect(screen.getByText("Tool did not complete")).not.toBeNull();
    expect(screen.getByRole("alert").textContent).toBe("Missing approval");
    expect(screen.getByRole("button", { name: "Submit explicitly" }).getAttribute("type")).toBe("submit");
    expect(screen.getByRole("button", { name: "Submit explicitly" }).className).toContain("plugin-action");
  });

  it("applies a button type to both fallback and injected DSH primitives", () => {
    function HostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>): React.ReactElement {
      return <button {...props} data-testid="host-button" />;
    }

    render(
      <DshPrimitiveProvider primitives={{ Button: HostButton }}>
        <PrimitiveButton>Confirm</PrimitiveButton>
      </DshPrimitiveProvider>
    );

    expect(screen.getByTestId("host-button").getAttribute("type")).toBe("button");
  });

  it("builds token fallbacks without expanding a raw CSS layout API", () => {
    expect(withFallback("--dsw-alias-label-primary", "#111111")).toBe("var(--dsw-alias-label-primary, #111111)");
  });
});
