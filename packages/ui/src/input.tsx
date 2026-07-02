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
}: InputProps) {
  const [focused, setFocused] = useState(false);

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
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "13px 16px",
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
