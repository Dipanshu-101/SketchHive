"use client";

import type { CSSProperties } from "react";

/**
 * Avatar — a deterministic, color-coded initials badge.
 *
 * Version 1 has no uploaded photos, so the avatar derives a stable color and
 * initials from the user's name/id. "Deterministic" matters: the same person
 * always gets the same hue across reloads and across every client, which makes
 * a busy room scannable. When photo URLs arrive later, pass `src` and the
 * initials become the fallback — no call-site change required.
 */
export interface AvatarProps {
  name: string;
  /** Optional stable seed (e.g. userId) so color survives display-name changes. */
  seed?: string;
  src?: string;
  size?: number;
  style?: CSSProperties;
}

/** A small, pleasant palette tuned for the dark glass backdrop. */
const PALETTE = [
  "#4f8cff",
  "#22d3ee",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#60a5fa",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function Avatar({ name, seed, src, size = 32, style }: AvatarProps) {
  const key = seed ?? name;
  const color = PALETTE[hashString(key) % PALETTE.length]!;
  const initials = initialsOf(name);

  const base: CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: Math.round(size * 0.4),
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#fff",
    userSelect: "none",
    // Tinted, glassy disc — a soft gradient from the assigned hue keeps it
    // lively without overpowering the message text beside it.
    backgroundColor: color,
    backgroundImage: `linear-gradient(135deg, ${color}, rgba(0,0,0,0.35))`,
    boxShadow: `0 0 0 1px rgba(255,255,255,0.14), 0 2px 8px rgba(0,0,0,0.4)`,
    overflow: "hidden",
    ...style,
  };

  if (src) {
    return (
      <div style={base} title={name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div style={base} title={name} aria-label={name}>
      {initials}
    </div>
  );
}
