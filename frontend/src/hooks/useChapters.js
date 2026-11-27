import { useState, useEffect, useRef } from "react";
import { chapters as registry } from "../content";

export function useChapters() {
  const [activeId, setActiveId] = useState(registry[0]?.id ?? null);
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // cache so re-visits are instant
  const cacheRef = useRef(new Map());

  useEffect(() => {
    if (!activeId) return;

    let cancelled = false;

    async function load() {
      // hit cache
      if (cacheRef.current.has(activeId)) {
        setChapterData(cacheRef.current.get(activeId));
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const entry = registry.find(c => c.id === activeId);
        if (!entry) throw new Error(`Chapter not found: ${activeId}`);

        const mod = await entry.load();
        const data = mod.default;

        if (cancelled) return;

        cacheRef.current.set(activeId, data);
        setChapterData(data);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeId]);

  return {
    chapters: registry,
    activeId,
    setActiveId,
    chapterData,
    loading,
    error,
  };
}