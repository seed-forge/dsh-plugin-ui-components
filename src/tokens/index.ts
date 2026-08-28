export const dshToken = {
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
} as const;

export function withFallback(variable: string, fallback: string): string {
  return `var(${variable}, ${fallback})`;
}
