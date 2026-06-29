"use client";

import React, { useState } from "react";

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
  error?: string; // if set, shows red border + error message below
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

  let border = "1px solid rgba(255,255,255,0.12)";
  let boxShadow = "0 1px 0 rgba(255,255,255,0.04) inset";

  if (error) {
    border = "1px solid rgba(239,68,68,0.5)";
    boxShadow = "0 0 0 3px rgba(239,68,68,0.12)";
  } else if (focused) {
    border = "1px solid rgba(59,130,246,0.6)";
    boxShadow =
      "0 0 0 3px rgba(59,130,246,0.15), 0 1px 0 rgba(255,255,255,0.06) inset";
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
            color: "rgba(180,210,255,0.5)",
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
          borderRadius: 11,
          fontSize: 14,
          background: "rgba(255,255,255,0.05)",
          border,
          color: "#fff",
          outline: "none",
          boxShadow,
          transition: "border-color 0.15s, box-shadow 0.15s",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxSizing: "border-box",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
      {error && (
        <div
          style={{
            fontSize: 12,
            color: "rgba(252,165,165,0.85)",
            marginTop: 6,
          }}
        >
          {error}
        </div>
      )}
      <style>{`
        input::placeholder { color: rgba(180,200,240,0.25); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px rgba(15,20,40,0.95) inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </div>
  );
}
