import { useCallback, useState } from "react";

/**
 * Small persisted list (saved conversions, rate alerts) backed by
 * localStorage in Phase 1. Phase 2 swaps the storage layer for the
 * Flask API without changing how pages call this hook.
 */
export function useLocalCollection(key, { limit } = {}) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  });

  const persist = useCallback(
    (next) => {
      setItems(next);
      localStorage.setItem(key, JSON.stringify(next));
    },
    [key]
  );

  const add = useCallback(
    (item) => {
      const withId = { id: Date.now(), ...item };
      const next = [withId, ...items];
      persist(limit ? next.slice(0, limit) : next);
      return withId;
    },
    [items, persist, limit]
  );

  const remove = useCallback(
    (id) => persist(items.filter((x) => x.id !== id)),
    [items, persist]
  );

  return { items, add, remove };
}

export default useLocalCollection;
