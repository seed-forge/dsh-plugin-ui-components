import type { ComponentType } from "react";

export type DuplicatePolicy = "reject" | "replace";

export interface RegistryEntry {
  id: string;
  label: string;
  order?: number;
  enabled?: boolean | (() => boolean);
}

export interface TabDescriptor extends RegistryEntry {
  render: ComponentType;
}

export interface ViewerDescriptor<Artifact = unknown> extends RegistryEntry {
  canView: (artifact: Artifact) => boolean;
  render: ComponentType<{ artifact: Artifact }>;
}

interface StoredEntry<T extends RegistryEntry> {
  value: T;
  token: number;
}

export interface RegistryListOptions {
  includeDisabled?: boolean;
}

export class ComponentRegistry<T extends RegistryEntry> {
  private readonly entries = new Map<string, StoredEntry<T>>();
  private readonly listeners = new Set<() => void>();
  private token = 0;

  public constructor(private readonly duplicatePolicy: DuplicatePolicy = "reject") {}

  public register(value: T): () => void {
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

  public get(id: string): T | undefined {
    return this.entries.get(id)?.value;
  }

  public list(options: RegistryListOptions = {}): T[] {
    const includeDisabled = options.includeDisabled ?? false;
    return [...this.entries.values()]
      .map((entry) => entry.value)
      .filter((entry) => includeDisabled || this.isEnabled(entry))
      .sort((left, right) => (left.order ?? 0) - (right.order ?? 0) || left.id.localeCompare(right.id));
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public clear(): void {
    if (this.entries.size === 0) return;
    this.entries.clear();
    this.notify();
  }

  private isEnabled(entry: T): boolean {
    return typeof entry.enabled === "function" ? entry.enabled() : entry.enabled !== false;
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export class TabRegistry extends ComponentRegistry<TabDescriptor> {}

export class ViewerRegistry<Artifact = unknown> extends ComponentRegistry<ViewerDescriptor<Artifact>> {
  public findFor(artifact: Artifact): ViewerDescriptor<Artifact> | undefined {
    return this.list().find((viewer) => viewer.canView(artifact));
  }
}
