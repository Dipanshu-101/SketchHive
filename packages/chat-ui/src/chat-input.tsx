"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { chatTheme } from "./theme";

/**
 * ChatInput — the message composer.
 *
 * Behaviour (Version 1 contract):
 *   - Enter sends; Shift+Enter inserts a newline.
 *   - The textarea auto-grows up to a max height, then scrolls.
 *   - Trimmed-empty input cannot be sent (button disabled, Enter is a no-op).
 *   - `disabled` (e.g. socket down) blocks input and the send button.
 *
 * It is a controlled-ish primitive that owns its own draft text and hands the
 * trimmed value to `onSend`. Keeping the draft local avoids re-rendering the
 * whole message list on every keystroke.
 */
export interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const MAX_TEXTAREA_HEIGHT = 140;

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Write a message…",
  maxLength = 4000,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled;

  function resize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    // Reset height on the next tick after the value clears.
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (ta) ta.style.height = "auto";
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Don't let canvas keyboard shortcuts (undo/redo/delete, space-pan) fire
    // while the user is typing a message.
    e.stopPropagation();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const wrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    padding: 8,
    borderRadius: chatTheme.radius,
    background: "rgba(8,11,20,0.55)",
    border: `1px solid ${focused ? chatTheme.accentGlow : "rgba(255,255,255,0.10)"}`,
    boxShadow: focused
      ? `0 0 0 3px ${chatTheme.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.04)`
      : "inset 0 1px 0 rgba(255,255,255,0.04)",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <div style={wrapStyle}>
      <textarea
        ref={taRef}
        value={value}
        rows={1}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={disabled ? "Reconnecting…" : placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          resize();
        }}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          resize: "none",
          border: "none",
          outline: "none",
          background: "transparent",
          color: chatTheme.text,
          fontSize: 13.5,
          lineHeight: 1.5,
          maxHeight: MAX_TEXTAREA_HEIGHT,
          padding: "6px 6px",
          fontFamily: "inherit",
          opacity: disabled ? 0.6 : 1,
        }}
      />
      <button
        type="button"
        aria-label="Send message"
        title="Send (Enter)"
        onClick={submit}
        disabled={!canSend}
        style={{
          flexShrink: 0,
          width: 34,
          height: 34,
          borderRadius: 10,
          border: "none",
          cursor: canSend ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: canSend
            ? `linear-gradient(135deg, ${chatTheme.accentDeep}, ${chatTheme.accent})`
            : "rgba(255,255,255,0.08)",
          boxShadow: canSend ? `0 0 16px ${chatTheme.accentGlow}` : "none",
          opacity: canSend ? 1 : 0.6,
          transition: "background 0.15s, box-shadow 0.15s, opacity 0.15s",
        }}
      >
        <SendIcon />
      </button>
      <style>{`textarea::placeholder { color: ${chatTheme.textFaint}; }`}</style>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.4 20.4L21 12 3.4 3.6 3 10l12 2-12 2 .4 6.4z"
        fill="currentColor"
      />
    </svg>
  );
}
