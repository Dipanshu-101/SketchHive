"use client";

import {
  forwardRef,
  useId,
  type CSSProperties,
  type ReactNode,
  type UIEventHandler,
} from "react";

/**
 * ScrollArea — a vertically scrollable region with a slim, app-matching
 * scrollbar (thin, translucent, hover-brightening) consistent across browsers.
 *
 * It forwards its ref to the scrolling element so the parent can drive
 * imperative auto-scroll (scrollTop = scrollHeight) and read scroll position to
 * decide whether the user is "near the bottom". A scoped class keeps the
 * webkit/Firefox scrollbar CSS from leaking to the rest of the app.
 */
export interface ScrollAreaProps {
  children: ReactNode;
  onScroll?: UIEventHandler<HTMLDivElement>;
  style?: CSSProperties;
  className?: string;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea({ children, onScroll, style, className }, ref) {
    const id = useId().replace(/[:]/g, "");
    const cls = `chat-scroll-${id}`;

    return (
      <div
        ref={ref}
        onScroll={onScroll}
        className={`${cls}${className ? ` ${className}` : ""}`}
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          // Reserve gutter so content doesn't shift when the scrollbar appears.
          scrollbarGutter: "stable",
          ...style,
        }}
      >
        {children}
        <style>{`
          .${cls} { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.18) transparent; }
          .${cls}::-webkit-scrollbar { width: 8px; }
          .${cls}::-webkit-scrollbar-track { background: transparent; }
          .${cls}::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.14);
            border-radius: 8px;
            border: 2px solid transparent;
            background-clip: content-box;
          }
          .${cls}::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.28);
            background-clip: content-box;
          }
        `}</style>
      </div>
    );
  }
);
