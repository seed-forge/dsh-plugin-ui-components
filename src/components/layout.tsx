import * as React from "react";

import { PrimitiveButton } from "../primitives";
import { useDshPluginUiStyles } from "../styles";
import { classNames } from "./shared";

export interface PluginSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  label: string;
}

export function PluginSurface({ children, className, label, ...props }: PluginSurfaceProps): React.ReactElement {
  useDshPluginUiStyles();
  return (
    <section {...props} aria-label={label} className={classNames("dsh-ui-surface", className)}>
      {children}
    </section>
  );
}

export interface PanelShellProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  onClose?: () => void;
  closeLabel?: string;
}

export function PanelShell({
  actions,
  children,
  className,
  closeLabel = "Close panel",
  description,
  onClose,
  title,
  ...props
}: PanelShellProps): React.ReactElement {
  useDshPluginUiStyles();
  return (
    <section {...props} className={classNames("dsh-ui-panel", className)}>
      <header className="dsh-ui-panel__header" style={{ padding: "12px 12px 10px" }}>
        <div style={{ minWidth: 0 }}>
          <strong>{title}</strong>
          {description ? <div className="dsh-ui-muted" style={{ fontSize: 12, marginTop: 3 }}>{description}</div> : null}
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
          {actions}
          {onClose ? <PrimitiveButton aria-label={closeLabel} onClick={onClose} title={closeLabel}>Close</PrimitiveButton> : null}
        </div>
      </header>
      <div style={{ padding: "0 12px 12px" }}>{children}</div>
    </section>
  );
}

export interface DockProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onClose: () => void;
  modal?: boolean;
  closeLabel?: string;
}

export function Dock({
  children,
  className,
  closeLabel = "Close dock",
  modal = false,
  onClose,
  open,
  title,
  ...props
}: DockProps): React.ReactElement | null {
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  useDshPluginUiStyles();

  React.useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: KeyboardEvent): void => {
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
  return (
    <aside
      {...props}
      aria-label={title}
      aria-modal={modal || undefined}
      className={classNames("dsh-ui-dock", className)}
      role={modal ? "dialog" : "complementary"}
    >
      <header className="dsh-ui-panel__header" style={{ padding: "12px" }}>
        <strong>{title}</strong>
        <button
          aria-label={closeLabel}
          className="dsh-ui-button"
          onClick={onClose}
          ref={closeButtonRef}
          title={closeLabel}
          type="button"
        >
          Close
        </button>
      </header>
      <div className="dsh-ui-dock__body" style={{ padding: "0 12px 12px" }}>{children}</div>
    </aside>
  );
}

export type DrawerProps = Omit<DockProps, "modal">;

export function Drawer(props: DrawerProps): React.ReactElement | null {
  return <Dock {...props} modal />;
}

export interface ScrollRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label: string;
}

export function ScrollRegion({ children, className, label, ...props }: ScrollRegionProps): React.ReactElement {
  useDshPluginUiStyles();
  return (
    <div {...props} aria-label={label} className={classNames("dsh-ui-scroll", className)} role="region" tabIndex={0}>
      {children}
    </div>
  );
}

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label: string;
}

export function Toolbar({ children, className, label, ...props }: ToolbarProps): React.ReactElement {
  useDshPluginUiStyles();
  return (
    <div {...props} aria-label={label} className={classNames("dsh-ui-toolbar", className)} role="toolbar">
      {children}
    </div>
  );
}
