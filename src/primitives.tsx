import * as React from "react";

export type PrimitiveButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface DshPrimitives {
  Button?: React.ComponentType<PrimitiveButtonProps>;
}

const DshPrimitivesContext = React.createContext<DshPrimitives>({});

export interface DshPrimitiveProviderProps {
  children: React.ReactNode;
  primitives: DshPrimitives;
}

export function DshPrimitiveProvider({ children, primitives }: DshPrimitiveProviderProps): React.ReactElement {
  return <DshPrimitivesContext.Provider value={primitives}>{children}</DshPrimitivesContext.Provider>;
}

export function useDshPrimitives(): DshPrimitives {
  return React.useContext(DshPrimitivesContext);
}

export interface PrimitiveButtonPropsWithTone extends PrimitiveButtonProps {
  tone?: "default" | "primary" | "danger";
}

export function PrimitiveButton({ className, tone = "default", ...props }: PrimitiveButtonPropsWithTone): React.ReactElement {
  const { Button } = useDshPrimitives();
  const toneClass = tone === "default" ? "" : ` dsh-ui-button--${tone}`;
  const resolvedClassName = `dsh-ui-button${toneClass}${className ? ` ${className}` : ""}`;
  const buttonProps = { ...props, type: props.type ?? "button" };
  if (Button) return <Button {...buttonProps} className={resolvedClassName} />;
  return <button {...buttonProps} className={resolvedClassName} />;
}
