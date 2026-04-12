import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  text: string;
}

const TOOLTIP_WIDTH = 256;

export function Tooltip({ text }: Props) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLSpanElement>(null);
  const clickOpened = useRef(false);

  function calcPos() {
    if (!btnRef.current) return null;
    const r = btnRef.current.getBoundingClientRect();
    const left = Math.max(
      8,
      Math.min(r.left + r.width / 2 - TOOLTIP_WIDTH / 2, window.innerWidth - TOOLTIP_WIDTH - 8)
    );
    return { top: r.bottom + 6, left };
  }

  function handleMouseEnter() {
    if (clickOpened.current) return;
    const p = calcPos();
    if (p) setPos(p);
  }

  function handleMouseLeave() {
    if (clickOpened.current) return;
    setPos(null);
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (clickOpened.current) {
      clickOpened.current = false;
      setPos(null);
    } else {
      clickOpened.current = true;
      const p = calcPos();
      if (p) setPos(p);
    }
  }

  // Close click-opened tooltip when clicking anywhere else
  useEffect(() => {
    if (!pos || !clickOpened.current) return;
    function onDocClick() {
      clickOpened.current = false;
      setPos(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [pos]);

  const lines = text.split("\n");

  return (
    <span className="inline-flex items-center ml-1">
      <span
        ref={btnRef}
        className="cursor-help select-none text-blue-400 hover:text-blue-600 text-[10px] leading-none font-bold rounded-full border border-current w-3.5 h-3.5 inline-flex items-center justify-center shrink-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-label="Help"
      >
        ?
      </span>

      {pos && createPortal(
        <div
          style={{ position: "fixed", top: pos.top, left: pos.left, width: TOOLTIP_WIDTH, zIndex: 9999 }}
          className="bg-white border border-gray-300 rounded shadow-lg p-2 text-xs text-gray-700 leading-relaxed"
          onMouseEnter={() => { if (!clickOpened.current) setPos(pos); }}
          onMouseLeave={() => { if (!clickOpened.current) setPos(null); }}
        >
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </div>,
        document.body
      )}
    </span>
  );
}
