import { useRef, useCallback, useEffect, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useChapters } from "../hooks/useChapters";
import { FIGURES } from "../content/diagrams";

const REMARK_PLUGINS = [remarkGfm, remarkMath];
const REHYPE_PLUGINS = [rehypeKatex];

function normalizeLatex(md) {
  return md
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `\n$$${inner}$$\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => `$${inner}$`);
}

const MarkdownSection = memo(function MarkdownSection({ heading, body, diagram }) {
  const normalized = useMemo(() => normalizeLatex(body), [body]);

  const Figure = diagram?.custom ? FIGURES[diagram.custom] : null;

  return (
    <section>
      {heading && <h2>{heading}</h2>}

      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
      >
        {normalized}
      </ReactMarkdown>

      {Figure && (
        <div className="learn-diagram">
          <Figure />
        </div>
      )}
    </section>
  );
});

export const LearnSidebar = memo(function LearnSidebar({ onClose }) {
  const { chapters, activeId, setActiveId, chapterData, loading, error } =
    useChapters();

  const sidebarRef = useRef(null);
  const widthRef = useRef(480);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const onMouseDown = useCallback((e) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = widthRef.current;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
  }, []);

  useEffect(() => {
    function onMouseMove(e) {
      if (!draggingRef.current) return;

      const delta = startXRef.current - e.clientX;
      let next = startWidthRef.current + delta;

      if (next < 320) next = 320;
      if (next > window.innerWidth - 200) next = window.innerWidth - 200;

      widthRef.current = next;
      if (sidebarRef.current) {
        sidebarRef.current.style.width = `${next}px`;
      }
    }

    function onMouseUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      className="learn-sidebar"
      ref={sidebarRef}
      style={{ width: `${widthRef.current}px` }}
    >
      <div className="learn-resize-handle" onMouseDown={onMouseDown} />

      <div className="learn-header">
        <span className="learn-title">Learning Guide</span>
        <button className="learn-close" onClick={onClose}>✕</button>
      </div>

      <div className="learn-body">
        <div className="learn-toc">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              className={`learn-toc-item ${ch.id === activeId ? "active" : ""}`}
              onClick={() => setActiveId(ch.id)}
            >
              {ch.title}
            </button>
          ))}
        </div>

        <div className="learn-article">
          {loading && <p>Loading…</p>}
          {error && <p>Failed to load: {error.message}</p>}

          {chapterData && !loading && (
            <>
              <h1>{chapterData.title}</h1>
              {chapterData.sections.map((section, i) => (
                <MarkdownSection
                  key={`${chapterData.id}-${i}`}
                  heading={section.heading}
                  body={section.body}
                  diagram={section.diagram}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
});