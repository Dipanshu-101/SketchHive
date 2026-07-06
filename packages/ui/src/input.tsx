"use client";

import React, { useState } from "react";
import { token, cssVar } from "./tokens";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "number"
  | "tel";

export interface InputProps {
  label?: string;
  type?: InputType; // default: "text"
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string; // if set, shows danger border + error message below
  disabled?: boolean;
  autoComplete?: string;
  name?: string;
  id?: string;
  /**
   * For `type="password"`, render a subtle eye toggle that reveals/hides the
   * value. Purely presentational — the `type` stays "password" while hidden and
   * the `onChange(value)` contract is unchanged. Ignored for other types.
   */
  revealToggle?: boolean;
}

/* Minimal inline eye / eye-off glyphs (no icon dependency in @repo/ui). */
function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

export function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled,
  autoComplete,
  name,
  id,
  revealToggle,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Password reveal is opt-in and only affects the rendered input `type`; the
  // logical field type stays "password" so autofill/managers behave normally.
  const showReveal = type === "password" && revealToggle;
  const renderedType = showReveal && revealed ? "text" : type;

  let border = `1px solid ${cssVar.color.border}`;
  let boxShadow = "none";

  // default → focus (honey ring) → error — all sourced from tokens (§2).
  if (error) {
    border = `1px solid ${cssVar.color.danger}`;
    boxShadow = `0 0 0 3px color-mix(in srgb, ${cssVar.color.danger} 18%, transparent)`;
  } else if (focused) {
    border = `1px solid ${cssVar.color.honey500}`;
    boxShadow = cssVar.shadow.glowHoney;
  }

  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: cssVar.color.textMuted,
            marginBottom: 8,
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          id={id}
          name={name}
          type={renderedType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: showReveal ? "13px 44px 13px 16px" : "13px 16px",
            borderRadius: token.radius.md,
            fontSize: 14,
            fontFamily: cssVar.font.sans,
            background: cssVar.color.bgElevated,
            border,
            color: cssVar.color.textPrimary,
            outline: "none",
            boxShadow,
            transition: `border-color ${cssVar.duration.base}, box-shadow ${cssVar.duration.base}`,
            boxSizing: "border-box",
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        {showReveal && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            disabled={disabled}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            tabIndex={disabled ? -1 : 0}
            style={{
              position: "absolute",
              top: "50%",
              right: 6,
              transform: "translateY(-50%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              padding: 0,
              border: "none",
              background: "transparent",
              borderRadius: token.radius.sm,
              color: revealed ? cssVar.color.honey500 : cssVar.color.textMuted,
              cursor: disabled ? "not-allowed" : "pointer",
              transition: `color ${cssVar.duration.base}`,
            }}
            onMouseEnter={(e) => {
              if (!disabled) e.currentTarget.style.color = cssVar.color.honey400;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = revealed
                ? cssVar.color.honey500
                : cssVar.color.textMuted;
            }}
          >
            <EyeIcon off={!revealed} />
          </button>
        )}
      </div>
      {error && (
        <div
          style={{
            fontSize: 12,
            color: cssVar.color.danger,
            marginTop: 6,
          }}
        >
          {error}
        </div>
      )}
      <style>{`
        input::placeholder { color: var(--color-text-muted); opacity: 0.7; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px var(--color-bg-elevated) inset !important;
          -webkit-text-fill-color: var(--color-text-primary) !important;
        }
      `}</style>
    </div>
  );
}
