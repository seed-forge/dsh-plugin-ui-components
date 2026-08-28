import { describe, expect, it, vi } from "vitest";

import { ComponentRegistry, TabRegistry, ViewerRegistry, type RegistryEntry, type TabDescriptor } from "../src/registry";

function EmptyTab(): null {
  return null;
}

describe("TabRegistry", () => {
  it("sorts entries, filters disabled entries, and disposes the matching registration", () => {
    const registry = new TabRegistry();
    const disposeFirst = registry.register({ id: "first", label: "First", order: 20, render: EmptyTab });
    registry.register({ id: "second", label: "Second", order: 10, render: EmptyTab });
    registry.register({ id: "hidden", label: "Hidden", enabled: false, render: EmptyTab });

    expect(registry.list().map((entry) => entry.id)).toEqual(["second", "first"]);
    expect(registry.list({ includeDisabled: true }).map((entry) => entry.id)).toEqual(["hidden", "second", "first"]);

    disposeFirst();
    expect(registry.get("first")).toBeUndefined();
  });

  it("rejects duplicate ids by default", () => {
    const registry = new TabRegistry();
    const tab: TabDescriptor = { id: "status", label: "Status", render: EmptyTab };
    registry.register(tab);

    expect(() => registry.register(tab)).toThrow("Duplicate registry id: status");
  });

  it("keeps a replacement when an obsolete disposer runs", () => {
    const registry = new TabRegistry("replace");
    const disposeOld = registry.register({ id: "status", label: "Old", render: EmptyTab });
    registry.register({ id: "status", label: "New", render: EmptyTab });

    disposeOld();
    expect(registry.get("status")?.label).toBe("New");
  });
});

describe("ViewerRegistry", () => {
  it("selects the first enabled viewer whose capability accepts the artifact", () => {
    const registry = new ViewerRegistry<{ kind: string }>();
    registry.register({ id: "image", label: "Image", canView: (artifact) => artifact.kind === "image", render: EmptyTab });
    registry.register({ id: "fallback", label: "Fallback", order: 20, canView: () => true, render: EmptyTab });

    expect(registry.findFor({ kind: "image" })?.id).toBe("image");
    expect(registry.findFor({ kind: "document" })?.id).toBe("fallback");
  });
});

describe("ComponentRegistry lifecycle", () => {
  it("notifies subscribers for registration and clear, then releases listeners", () => {
    const registry = new ComponentRegistry<RegistryEntry>();
    const listener = vi.fn();
    const unsubscribe = registry.subscribe(listener);

    registry.register({ id: "status", label: "Status" });
    registry.clear();
    unsubscribe();
    registry.register({ id: "next", label: "Next" });

    expect(listener).toHaveBeenCalledTimes(2);
    expect(registry.get("next")?.label).toBe("Next");
  });

  it("evaluates dynamic enabled entries and leaves an empty registry unchanged", () => {
    let enabled = false;
    const registry = new ComponentRegistry<RegistryEntry>();
    registry.clear();
    registry.register({ enabled: () => enabled, id: "conditional", label: "Conditional" });
    registry.register({ id: "default", label: "Default" });

    expect(registry.list().map((entry) => entry.id)).toEqual(["default"]);
    enabled = true;
    expect(registry.list().map((entry) => entry.id)).toEqual(["conditional", "default"]);
  });
});
